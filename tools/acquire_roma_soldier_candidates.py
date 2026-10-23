#!/usr/bin/env python3
"""CUB ROMA strict red-team of physical CC0 humanoid rig candidates: no mislabeled production files."""
from pathlib import Path
from urllib.request import urlopen,Request
import json,hashlib,struct
OUT=Path(__file__).resolve().parents[1]/'assets/roma_alt_soldiers_cc0';OUT.mkdir(parents=True,exist_ok=True)
SRC=[
 ('quaternius_knight','https://raw.githubusercontent.com/ilrein/warptracker/main/public/models/knight.glb','Quaternius Animated Knight Pack','https://github.com/ilrein/warptracker/blob/main/ASSETS.md'),
 ('quaternius_ubc_wip','https://raw.githubusercontent.com/ilrein/warptracker/main/art/hero-ubc-wip.glb','Quaternius Universal Base Characters + Universal Animation Library','https://github.com/ilrein/warptracker/blob/main/ASSETS.md'),
 ('quaternius_skeleton','https://raw.githubusercontent.com/ilrein/warptracker/main/public/models/skeleton.glb','Quaternius Animated Monster Pack','https://github.com/ilrein/warptracker/blob/main/ASSETS.md'),
 ('gobkit_humanoid_a01','https://raw.githubusercontent.com/Ariescar/gobkit-free-assets/main/minion/minion-a01.glb','Gobkit / Alsomind Tech','https://github.com/Ariescar/gobkit-free-assets/blob/main/LICENSE'),
 ('gobkit_humanoid_d01','https://raw.githubusercontent.com/Ariescar/gobkit-free-assets/main/minion/minion-d01.glb','Gobkit / Alsomind Tech','https://github.com/Ariescar/gobkit-free-assets/blob/main/LICENSE')
]
records=[]
for name,url,author,evidence in SRC:
 try:
  data=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 CUB License Research'}),timeout=100).read(5_000_000)
  if data[:4]!=b'glTF':raise ValueError('Not GLB')
  jl,typ=struct.unpack_from('<I4s',data,12)
  doc=json.loads(data[20:20+jl])
  tris=0
  for mesh in doc.get('meshes',[]):
   for prim in mesh.get('primitives',[]):
    count=doc['accessors'][prim['indices']]['count'] if 'indices' in prim else doc['accessors'][prim['attributes']['POSITION']]['count']
    tris+=count//3 if prim.get('mode',4)==4 else 0
  clips=[x.get('name','unnamed') for x in doc.get('animations',[])]
  bones=max((len(x.get('joints',[])) for x in doc.get('skins',[])),default=0)
  f=OUT/(name+'.glb');f.write_bytes(data)
  status='CANDIDATE_UNVERIFIED_VISUAL' if bones>0 and len(clips)>0 else 'NOT_FULLY_RIGGED'
  rec={'file':f.name,'triangles':tris,'bones':bones,'clips':clips,'animations':len(clips),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'source':url,'author':author,'license':'CC0-1.0','license_evidence':evidence,'classification':status,'passes_polygon_budget':1500<=tris<=3000,'passes_skeleton':0<bones<=60,'passes_clip_count_min':len(clips)>=7,'origin_scale_animations_not_yet_verified':True}
  print('OK',name,'tri',tris,'bones',bones,'animations',len(clips),flush=True)
  records.append(rec)
 except Exception as e:records.append({'id':name,'error':str(e),'classification':'FAILED'});print('FAIL',name,str(e),flush=True)
(OUT/'MANIFEST.json').write_text(json.dumps({'policy':'Physical public CC0 Quaternius/Gobkit downloads, not endorsed as historically Roman or production-ready until QA','files':records},indent=2)+'\n')
(OUT/'SOURCES.md').write_text('# CC0 origins\n- https://github.com/ilrein/warptracker/blob/main/ASSETS.md\n- https://github.com/Ariescar/gobkit-free-assets/blob/main/LICENSE\n\nQuaternius knight/UBC are CC0 per source file policy. No Mixamo.\n')
if sum(x.get('triangles',0)>0 for x in records)<3:raise SystemExit('Insufficient real rig candidates')
