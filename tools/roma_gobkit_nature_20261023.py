#!/usr/bin/env python3
"""Acquire authentic CC0 game nature GLB from Gobkit; raw models, no simulated replacements."""
from pathlib import Path
from urllib.request import Request,urlopen
import json,hashlib
DEST=Path(__file__).resolve().parents[1]/'assets/roma_gobkit_nature_cc0'
DEST.mkdir(parents=True,exist_ok=True)
names=['Bush001','Bush002','Cliff001','Cliff002','Cliff003','Grass001','Grass002','Grass003',
'Hill001','Hill002','Hill003','HillSand001','HillSand002','HillSand003','Mountain001','Mountain002','Mountain003','MountainFar001','MountainFar002','MountainFar003',
'Reed001','Reed002','Rock001','Rock002','Rock003','TreeHigh001','TreeHigh002','TreeHigh003','TreeLow001','TreeLow002','TreeLow003','TreeLow004','TreeMed001','TreeMed002','TreeMed003',
'Cloud001','Cloud002','Cloud003']
base='https://raw.githubusercontent.com/Ariescar/gobkit-free-assets/main/nature/'
files=[];errors=[]
for n in names:
 try:
  url=base+n+'.glb';b=urlopen(Request(url,headers={'User-Agent':'CUB Game Lab official CC0-asset library'}),timeout=60).read(300000)
  if b[:4]!=b'glTF' or len(b)<3000:raise ValueError('not a complete binary glTF')
  fn=DEST/(n+'.glb');fn.write_bytes(b)
  files.append({'file':fn.name,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'license':'CC0-1.0','author':'Gobkit / Alsomind Tech','source_url':url,'license_url':'https://github.com/Ariescar/gobkit-free-assets/blob/main/LICENSE','historical_specificity':'GENERIC NOT PERIOD-ACCURATE'})
 except Exception as e:errors.append({'file':n,'error':str(e)})
 print(n,'OK' if files and files[-1]['file']==n+'.glb' else 'FAIL',flush=True)
(DEST/'MANIFEST.json').write_text(json.dumps({'assets':files,'errors':errors,'notice':'Actual unmodified external GLBs; all still need LOD and visual style checks.'},indent=2)+'\n')
if len(files)<30:raise SystemExit('Not enough physical CC0 models')
