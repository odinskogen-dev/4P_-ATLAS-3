#!/usr/bin/env python3
"""CUB ROMA geodata build. Independent sources; failures never disguised as data."""
import hashlib, json, os, shutil, sys, time, zipfile
from pathlib import Path
from urllib.parse import urlencode
import numpy as np
import requests
from PIL import Image
Image.MAX_IMAGE_PIXELS = None  # NASA 500 m tiles are 21600x21600 pixels.
from rasterio.io import MemoryFile
from rasterio.warp import reproject, Resampling
from rasterio.transform import from_bounds

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/roma_expanded_world_20261023'
CACHE=ROOT/'.world_cache'
OUT.mkdir(parents=True,exist_ok=True);CACHE.mkdir(exist_ok=True)
BOUNDS=(-20.,5.,90.,66.)
W=4096
H=round(W*(66-5)/(90-(-20)))  # 2271
NASA_BASE='https://assets.science.nasa.gov/content/dam/science/esd/eo/images/bmng/bmng-topography'
NCSS='https://www.ngdc.noaa.gov/thredds/ncss/grid/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc'
WCS='https://www.ngdc.noaa.gov/thredds/wcs/global/ETOPO2022/60s/60s_surface_elev_netcdf/ETOPO_2022_v1_60s_N90W180_surface.nc'
STATUS={}
session=requests.Session();session.headers.update({'User-Agent':'CUB-ROMA-Geodata/2026 (public sources; credit NASA, NOAA, Natural Earth)'})

def download(url,path,min_bytes=1024):
    path=Path(path)
    if path.exists() and path.stat().st_size>=min_bytes:return path
    print('DOWNLOAD',url,flush=True)
    for n in range(3):
        try:
            with session.get(url,stream=True,timeout=(20,240)) as r:
                r.raise_for_status()
                content_type=r.headers.get('content-type','')
                if 'html' in content_type or 'xml' in content_type:
                    raise ValueError('Server returned '+content_type+' instead of raster')
                tmp=path.with_suffix(path.suffix+'.part')
                with open(tmp,'wb') as f:
                    for chunk in r.iter_content(1024*1024):
                        if chunk:f.write(chunk)
                if tmp.stat().st_size<min_bytes: raise ValueError(f'File too small: {tmp.stat().st_size}')
                tmp.replace(path)
                return path
        except Exception as e:
            print(f'RETRY {n+1}: {e}',flush=True)
            time.sleep(2*(n+1))
    raise RuntimeError('Download failed: '+url)

def build_nasa(month):
    code='01' if month=='january' else '07'
    tile_files={}
    for zone in ['B1','C1']:
        name=f'world.topo.2004{code}.3x21600x21600.{zone}.jpg'
        url=f'{NASA_BASE}/{month}/{name}'
        tile_files[zone]=download(url,CACHE/name,min_bytes=1_000_000)
    for p in tile_files.values():
        with Image.open(p) as im:
            if im.size!=(21600,21600):raise ValueError(f'Unexpected NASA tile dimension: {p} = {im.size}')
    images={k:Image.open(f) for k,f in tile_files.items()}
    outdir=OUT/f'bluemarble_{month}_500m_source'
    outdir.mkdir(parents=True,exist_ok=True)
    tile_h=round(4096*(61/3)/22)  # 3785: each 22° x 20.333° geographical tile
    records=[]
    for r in range(3):
        for c in range(5):
            lon0=-20+c*22.;lon1=lon0+22.
            lat1=66-r*(61/3);lat0=lat1-(61/3)
            tile=Image.new('RGB',(4096,tile_h))
            for zone,west,east in [('B1',-90,0),('C1',0,90)]:
                x0=max(lon0,west);x1=min(lon1,east)
                if x1<=x0:continue
                sx0=round((x0-west)/90*21600);sx1=round((x1-west)/90*21600)
                sy0=round((90-lat1)/90*21600);sy1=round((90-lat0)/90*21600)
                dx0=round((x0-lon0)/(lon1-lon0)*4096);dx1=round((x1-lon0)/(lon1-lon0)*4096)
                piece=images[zone].crop((sx0,sy0,sx1,sy1)).resize((dx1-dx0,tile_h),Image.Resampling.LANCZOS)
                tile.paste(piece,(dx0,0))
            fname=f'bluemarble_{month}_r{r}c{c}.jpg'
            tile.save(outdir/fname,quality=90,optimize=True,subsampling=0)
            records.append({'filename':str((outdir/fname).relative_to(OUT)),'row':r,'column':c,'bounds_lonlat':[lon0,lat0,lon1,lat1],'width':4096,'height':tile_h})
            print('OUTPUT',fname,flush=True)
    for im in images.values():im.close()
    return records

def fetch_etopo_erddap():
    """Fetch numeric ETOPO 2022 via NOAA ERDDAP, splitting the 0..360 longitude grid."""
    from netCDF4 import Dataset
    base='https://oceanwatch.pifsc.noaa.gov/erddap/griddap/ETOPO_2022_v1_60s.nc'
    parts=[];urls=[]
    for tag,west,east in [('west',340,359.99),('east',0,89.99)]:
        url=f'{base}?z[(5):1:(66)][({west}):1:({east})]'
        file=download(url,CACHE/f'etopo_erddap_{tag}.nc',min_bytes=150_000)
        with Dataset(file) as nc:
            lat=np.asarray(nc.variables['latitude'][:],dtype='float64')
            lon=np.asarray(nc.variables['longitude'][:],dtype='float64')
            z=np.ma.filled(nc.variables['z'][:],np.nan).astype('float32')
            if z.shape!=(len(lat),len(lon)) or len(lat)<2000 or len(lon)<500:
                raise ValueError('Unexpected/incomplete NOAA subset: '+str(z.shape))
            if np.any(np.diff(lat)<0):z=z[::-1,:];lat=lat[::-1]
            if np.any(np.diff(lon)<0):z=z[:,::-1];lon=lon[::-1]
            if tag=='west':lon-=360
            parts.append((lat,lon,z));urls.append(url)
    latw,lonw,zw=parts[0];late,lone,ze=parts[1]
    if len(latw)!=len(late) or not np.allclose(latw,late,atol=1e-5):
        raise ValueError('NOAA latitude grids do not align')
    lon=np.concatenate((lonw,lone))
    if not np.all(np.diff(lon)>0):raise ValueError('NOAA longitudes unordered')
    raw=np.concatenate((zw,ze),axis=1)
    if np.count_nonzero(np.isfinite(raw))<0.99*raw.size:
        raise ValueError('ETOPO missing values')
    surface=np.asarray(Image.fromarray(np.ascontiguousarray(raw[::-1,:],dtype=np.float32)).resize((W,H),Image.Resampling.BILINEAR),dtype='float32')
    if not (float(np.nanmin(surface))<-3000 and float(np.nanmax(surface))>1500):
        raise ValueError('ETOPO range failed sanity check')
    return surface,'; '.join(urls)

def build_etopo():
    paths=[]
    # THREDDS WCS delivers original numeric elevations, not a coloured preview.
    for coverage in ['z','elevation']:
        q=dict(service='WCS',version='1.0.0',request='GetCoverage',coverage=coverage,
               bbox='-20,5,90,66',crs='EPSG:4326',response_crs='EPSG:4326',
               format='GeoTIFF',width='4096',height=str(H))
        paths.append(WCS+'?'+urlencode(q))
    # NCSS alternative; accepts spatial subset for NetCDF rather than global raster download.
    for var in ['z','elevation']:
        q=dict(var=var,north='66',south='5',west='-20',east='90',horizStride='1',accept='netcdf4')
        paths.append(NCSS+'?'+urlencode(q))
    data=None;provenance=None
    # Prefer NOAA ERDDAP geographic subsets; avoid downloading a global raster.
    try:data,provenance=fetch_etopo_erddap()
    except Exception as e:print('ETOPO ERDDAP PRIMARY FAILED:',str(e),flush=True)
    for idx,url in enumerate(paths):
        if data is not None:break
        try:
            fname=CACHE/('etopo_subset_'+str(idx)+('.tif' if idx<2 else '.nc'))
            download(url,fname,min_bytes=100_000)
            import rasterio
            with rasterio.open(fname) as src:
                if not src.crs or src.count<1:raise ValueError('ETOPO source lacks georeferencing')
                arr=np.empty((H,W),dtype='float32')
                reproject(source=rasterio.band(src,1),destination=arr,src_transform=src.transform,
                          src_crs=src.crs,dst_transform=from_bounds(*BOUNDS,W,H),dst_crs='EPSG:4326',
                          dst_nodata=np.nan,resampling=Resampling.bilinear)
            valid=np.isfinite(arr)
            if valid.mean()<0.99: raise ValueError(f'missing elevations: {valid.mean():.2%}')
            low=float(np.nanmin(arr));high=float(np.nanmax(arr))
            if not (low<-3000 and high>1500 and high<10000 and low>-12000):
                raise ValueError(f'implausible elevation range {low}..{high}')
            data=arr;provenance=url;break
        except Exception as e:print('ETOPO URL FAILED',idx,str(e),flush=True)
    if data is None:
        try:data,provenance=fetch_etopo_erddap()
        except Exception as e:print('ETOPO ERDDAP FAILED:',str(e),flush=True)
    if data is None:raise RuntimeError('All NOAA numeric elevation subset endpoints failed, including ERDDAP')
    # 16-bit PNG is unsigned; exact integer-metre elevations recover via value-32768.
    encoded=(np.rint(data).astype('int32')+32768)
    if encoded.min()<0 or encoded.max()>65535:raise ValueError('Unrepresentable signed 16-bit elevations')
    img=Image.fromarray(np.ascontiguousarray(encoded,dtype=np.uint16))
    dst=OUT/'etopo2022_surface_60s_crop_16bit.png';img.save(dst)
    with Image.open(dst) as chk:
        if chk.size!=(W,H) or np.asarray(chk).dtype.itemsize!=2: raise RuntimeError('16-bit output QA failed')
    info={'dataset':'ETOPO 2022 60-arc-second surface elevation','bounds_lonlat':BOUNDS,'width':W,'height':H,
          'png_encoding':'uint16 raw; decode metres = pixel - 32768',
          'source_min_m':round(float(np.nanmin(data)),2),'source_max_m':round(float(np.nanmax(data)),2),
          'pixel_min_m':int(encoded.min())-32768,'pixel_max_m':int(encoded.max())-32768,
          'vertical_datum':'EGM2008','source_url':provenance,'license':'CC0-1.0',
          'orientation':'top left northwest; rows run from north to south'}
    (OUT/'etopo2022_height_decode.json').write_text(json.dumps(info,indent=2)+'\n')
    return info


def build_natural_earth_layers():
    """Download original Natural Earth 1:10m public domain source shapefiles and clip to map extent."""
    import shapefile
    from shapely.geometry import shape, mapping, box
    boundpoly=box(*BOUNDS)
    summaries={}
    for layer in ['rivers_lake_centerlines','lakes']:
        base=f'ne_10m_{layer}'
        url=f'https://naturalearth.s3.amazonaws.com/10m_physical/{base}.zip'
        zpath=download(url,CACHE/f'{base}.zip',min_bytes=12000)
        dest=CACHE/base; dest.mkdir(parents=True,exist_ok=True)
        with zipfile.ZipFile(zpath) as archive:
            for n in archive.namelist():
                if n.endswith(('.shp','.shx','.dbf','.prj')):
                    (dest/Path(n).name).write_bytes(archive.read(n))
        reader=shapefile.Reader(str(dest/(base+'.shp')))
        feats=[]
        for item in reader.iterShapeRecords():
            try:
                g=shape(item.shape.__geo_interface__)
                if not g.intersects(boundpoly):continue
                clipped=g.intersection(boundpoly)
                if clipped.is_empty:continue
                record=item.record.as_dict()
                props={k:record.get(k) for k in ('name','name_en','featurecla','scalerank','min_zoom') if k in record}
                feats.append({'type':'Feature','properties':props,'geometry':mapping(clipped)})
            except Exception as e:
                print('FEATURE SKIP',layer,str(e)[:200],flush=True)
        if len(feats)<30:raise RuntimeError('Too few Natural Earth '+layer+' features '+str(len(feats)))
        dst=OUT/f'{base}_expanded.geojson'
        dst.write_text(json.dumps({'type':'FeatureCollection','features':feats},ensure_ascii=False,separators=(',',':'))+'\n')
        summaries[layer]={'path':dst.name,'features':len(feats),'source':url,'license':'public domain','bounds_lonlat':BOUNDS}
        print('NATURAL EARTH',layer,len(feats),flush=True)
    return summaries

def main():
    try:STATUS['natural_earth_10m']={'status':'ok','layers':build_natural_earth_layers()}
    except Exception as e:STATUS['natural_earth_10m']={'status':'failed','error':str(e)}
    for month in ['july','january']:
        try:STATUS['nasa_'+month]={'status':'ok','tiles':build_nasa(month)}
        except Exception as e:STATUS['nasa_'+month]={'status':'failed','error':str(e)}
    try:STATUS['noaa_etopo2022']={'status':'ok','heightmap':build_etopo()}
    except Exception as e:STATUS['noaa_etopo2022']={'status':'failed','error':str(e)}
    for name,path in sorted([(p.relative_to(OUT).as_posix(),p) for p in OUT.rglob('*') if p.is_file() and p.name!='MANIFEST.json']):
        STATUS.setdefault('file_hashes',{})[name]={'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size}
    (OUT/'MANIFEST.json').write_text(json.dumps(STATUS,indent=2,ensure_ascii=False)+'\n')
    print('RESULTS',json.dumps({k:v.get('status') for k,v in STATUS.items() if k!='file_hashes'}),flush=True)
    if any(STATUS.get(k,{}).get('status')!='ok' for k in ['natural_earth_10m','nasa_july','noaa_etopo2022']):raise SystemExit('Geodata acquisition did not meet acceptance criteria')

if __name__=='__main__':main()