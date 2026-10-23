#!/usr/bin/env python3
"""ROMA SRTMGL1 30m historical battle site samples. Raw source = NASA SRTM via ESA STEP mirror."""
import csv,io,json,hashlib,math,os,zipfile
from pathlib import Path
from urllib.request import Request,urlopen
import numpy as np
from PIL import Image
import rasterio
from rasterio.transform import from_bounds
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/battle_dem_srtm30'
OUT.mkdir(parents=True,exist_ok=True)
CACHE=ROOT/'.srtm_cache';CACHE.mkdir(exist_ok=True)
BASE='https://step.esa.int/auxdata/dem/SRTMGL1/'
SITES={
'Cannae':(41.310,16.130,'Battle 216 BCE; approximate'),
'Trebia':(45.061,9.683,'Battle 218 BCE; approximate'),
'Lake_Trasimene':(43.119,12.098,'Battle 217 BCE; approximate'),
'Zama':(36.340,9.690,'Battle 202 BCE; site disputed, example location only'),
'Cynoscephalae':(39.330,22.740,'Battle 197 BCE; approximate'),
'Pydna':(40.370,22.620,'Battle 168 BCE; approximate'),
'Alesia':(47.537,4.502,'Battle 52 BCE outside initial game period'),
'Messana':(38.194,15.554,'Messana; strategic location rather than battle site'),
'Saguntum':(39.680,-0.275,'Siege 219 BCE; approximate'),
'Syracuse':(37.075,15.287,'Syracuse; settlement centre'),
'Carthage':(36.851,10.322,'Carthage; settlement centre')
}
def tile_id(lat,lon):
 a=math.floor(lat);b=math.floor(lon)
 return f'{"N" if a>=0 else "S"}{abs(a):02d}{"E" if b>=0 else "W"}{abs(b):03d}'
def fetch(tid):
 url=f'{BASE}{tid}.SRTMGL1.hgt.zip'
 path=CACHE/(tid+'.zip')
 if not path.exists():
  with urlopen(Request(url,headers={'User-Agent':'CUB-ROMA-research/2026'}),timeout=150) as r:
   buf=r.read()
  if len(buf)<30000 or not zipfile.is_zipfile(io.BytesIO(buf)):raise RuntimeError('Invalid SRTM zip: '+url)
  path.write_bytes(buf)
 with zipfile.ZipFile(path) as z:
  member=next((x for x in z.namelist() if x.lower().endswith('.hgt')),None)
  if not member:raise RuntimeError('No HGT in '+url)
  raw=z.read(member)
 if len(raw)!=3601*3601*2:raise RuntimeError(f'Unexpected 1-arc-second HGT bytes {len(raw)}: {tid}')
 return np.frombuffer(raw,dtype='>i2').reshape((3601,3601)),url
def crop(tid,lat,lon,raster,km=3.):
 half_lat=(km/2)/111.195
 half_lon=(km/2)/(111.195*math.cos(math.radians(lat)))
 latf=math.floor(lat);lonf=math.floor(lon)
 north=min(latf+1,lat+half_lat);south=max(latf,lat-half_lat)
 west=max(lonf,lon-half_lon);east=min(lonf+1,lon+half_lon)
 r0=max(0,round((latf+1-north)*3600));r1=min(3600,round((latf+1-south)*3600))
 c0=max(0,round((west-lonf)*3600));c1=min(3600,round((east-lonf)*3600))
 subset=raster[r0:r1+1,c0:c1+1].astype('int32')
 if subset.size<1000:raise ValueError('Small subset: '+tid)
 if ((subset==-32768).mean()>0.015):raise ValueError('Too many void samples')
 encoded=np.clip(subset+32768,0,65535).astype('uint16')
 return (encoded,(lonf+c0/3600,latf+1-r1/3600,lonf+c1/3600,latf+1-r0/3600),subset)
def main():
 manifest={'origin':'NASA SRTMGL1 distributed by ESA STEP','method':'30m 1 arcsecond raw HGT windows, nearest original samples; NO synthetic heights','license':'NASA/USGS public domain: credit NASA/USGS; ESA mirror','sites':{},'errors':{}}
 for name,(lat,lon,note) in SITES.items():
  try:
   tid=tile_id(lat,lon);dem,url=fetch(tid)
   arr,bounds,raw=crop(tid,lat,lon,dem)
   d=OUT/name;d.mkdir(parents=True,exist_ok=True)
   path=d/'height16.png'
   Image.fromarray(np.ascontiguousarray(arr)).save(path)
   tif=d/'height_m.tif'
   with rasterio.open(tif,'w',driver='GTiff',height=raw.shape[0],width=raw.shape[1],count=1,dtype='int16',crs='EPSG:4326',transform=from_bounds(*bounds,raw.shape[1],raw.shape[0]),compress='deflate',nodata=-32768) as out:
    out.write(raw.astype('int16'),1)
   info={'place':name,'point_lonlat':[lon,lat],'bounds_lonlat':bounds,'pixel_size_arcsec':1,
      'original_resolution_approx_m':30,'width':arr.shape[1],'height':arr.shape[0],
      'min_m':int(raw[raw!=-32768].min()),'max_m':int(raw.max()),'void_pixels':int((raw==-32768).sum()),
      'png_encoding':'unsigned 16-bit pixel; metres = pixel - 32768 (pixel 0 = nodata)',
      'source_url':url,'source_tile':tid,'license':'NASA/USGS public domain','historical_location_note':note}
   (d/'metadata.json').write_text(json.dumps(info,indent=2)+'\n')
   manifest['sites'][name]=info
   print('OK',name,tid,arr.shape,info['min_m'],info['max_m'],flush=True)
  except Exception as e:
   manifest['errors'][name]=str(e)
   print('FAILED',name,str(e),flush=True)
 for f in OUT.rglob('*'):
  if f.is_file():manifest.setdefault('sha256',{})[f.relative_to(OUT).as_posix()]=hashlib.sha256(f.read_bytes()).hexdigest()
 (OUT/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
 if len(manifest['sites'])<8:raise SystemExit('Too few real DEM sites: '+str(len(manifest['sites'])))
if __name__=='__main__':main()
