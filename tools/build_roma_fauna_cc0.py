#!/usr/bin/env python3
"""Stage verifiably CC0 real nature GLB and rigged elephant original.
Attempts portable Blender GLB export without inventing missing war-animations.
"""
import json,hashlib,urllib.request,subprocess,os
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'assets/roma_fauna_cc0_20261023'
OUT.mkdir(parents=True,exist_ok=True)
sources=[]
base='https://raw.githubusercontent.com/Ariescar/gobkit-free-assets/main/'
for x in ['Reed001','Reed002','Bush001','Bush002','Cliff001','Cliff002','MountainFar001','MountainFar002','Rock001','Rock002','TreeHigh001','TreeMed001','TreeLow001']:
 sources.append((f'nature/{x}.glb',base+f'nature/{x}.glb','Gobkit / Alsomind Tech','https://github.com/Ariescar/gobkit-free-assets/blob/main/LICENSE'))
sources.append(('elephant/elephant-lowpoly.blend','https://opengameart.org/sites/default/files/elephant-lowpoly.blend','syncopika','https://opengameart.org/content/low-poly-elephant-model'))
records=[]
for path,url,author,lic in sources:
 item=OUT/path;item.parent.mkdir(parents=True,exist_ok=True)
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 ROMA research download'})
  with urllib.request.urlopen(req,timeout=120) as f:buf=f.read(8_000_000)
  if len(buf)<1000:raise ValueError('invalid size')
  if item.suffix=='.glb' and buf[:4]!=b'glTF':raise ValueError('invalid GLB magic')
  if item.suffix=='.blend' and not buf.startswith(b'BLENDER'):raise ValueError('invalid Blender signature')
  item.write_bytes(buf)
  records.append({'path':path,'source':url,'author':author,'license':'CC0-1.0','license_evidence':lic,'bytes':len(buf),'sha256':hashlib.sha256(buf).hexdigest(),'status':'acquired'})
  print('OK',path,len(buf),flush=True)
 except Exception as e:records.append({'path':path,'status':'failed','error':str(e)});print('FAIL',path,e,flush=True)
blend=OUT/'elephant/elephant-lowpoly.blend'
if blend.exists() and subprocess.run(['which','blender'],capture_output=True).returncode==0:
 expr=OUT/'convert_elephant.py'
 expr.write_text("""import bpy,json
from pathlib import Path
root=Path(__file__).resolve().parent
src=root/'elephant/elephant-lowpoly.blend'
try:
 bpy.ops.wm.open_mainfile(filepath=str(src))
 for o in bpy.data.objects:
  if o.type=='ARMATURE':print('RIG_BONES',len(o.data.bones))
 bpy.ops.export_scene.gltf(filepath=str(root/'elephant/elephant_portable_source.glb'),export_format='GLB',export_animations=True,export_skins=True,export_yup=True)
 print('EXPORTED')
except Exception as e:print('BLENDER_FAIL',str(e))
""")
 result=subprocess.run(['blender','-b','--python',str(expr)],capture_output=True,text=True,timeout=240)
 (OUT/'elephant/blender_export.log').write_text(result.stdout[-10000:]+'\n'+result.stderr[-3000:])
 glb=OUT/'elephant/elephant_portable_source.glb'
 if glb.exists() and glb.stat().st_size>1000 and glb.read_bytes()[:4]==b'glTF':
  records.append({'path':'elephant/elephant_portable_source.glb','author':'syncopika; converted by CUB','license':'CC0-1.0','source':'https://opengameart.org/content/low-poly-elephant-model','bytes':glb.stat().st_size,'sha256':hashlib.sha256(glb.read_bytes()).hexdigest(),'status':'exported_unverified_animation_budget'})
 (OUT/'elephant/convert_elephant.py').unlink(missing_ok=True)
manifest={'purpose':'Reusable CC0 library, not production-ready elephant','quality_note':'Elephant author lists idle/eating/sitting/getting up/angry; does NOT include walk/trample/death. Do not claim finished war elephant.','files':records}
(OUT/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
if sum(x['status']=='acquired' for x in records)<10:raise SystemExit('Too few verified CC0 assets.')
