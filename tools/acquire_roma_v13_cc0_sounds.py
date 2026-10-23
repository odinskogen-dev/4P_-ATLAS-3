#!/usr/bin/env python3
"""Download physically real CC0 sound source files. No fake field recordings, no CC-BY tracks."""
from pathlib import Path
import urllib.request,json,hashlib,zipfile,io
DEST=Path(__file__).resolve().parents[1]/'assets/roma_v13_real_cc0_sound'
DEST.mkdir(parents=True,exist_ok=True)
# Explicit OpenGameArt pages verified to offer CC0 option.
SOURCES=[
 ('camel_groan','https://opengameart.org/content/camel-groan','camel.zip','AntumDeluge / original craigsmith','camel vocalisation, source recording'),
 ('wave_01','https://opengameart.org/content/beach-ocean-waves','wave_01_cc0-18363__jasinski__alkaibeach.flac','jasinski / qubodup','beach ocean water'),
 ('wave_02','https://opengameart.org/content/beach-ocean-waves','wave_02_cc0-18363__jasinski__alkaibeach.flac','jasinski / qubodup','beach ocean water'),
 ('wave_03','https://opengameart.org/content/beach-ocean-waves','wave_03_cc0-18363__jasinski__alkaibeach.flac','jasinski / qubodup','beach ocean water'),
 ('fire','https://opengameart.org/content/fire-crackling','fire-1.ogg','AntumDeluge','fire crackling'),
 ('war_horns','https://opengameart.org/content/war-horns','war_horns.mp3','Eldritch Grim','music war-horn texture; not a verified historical cornu'),
 ('breaks','https://opengameart.org/content/75-cc0-breaking-falling-hit-sfx','sfx_breaking_and_falling.zip','rubberduck','breaking falling hitting stone wood'),
 ('bows','https://opengameart.org/content/battle-sound-effects','battle_sound_effects_0.zip','artisticdude / Ogrebane','bow firing / swishes')
]
def get(url,expected=1000):
 req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (CUB-GameLab-CC0-asset-evaluation)'})
 with urllib.request.urlopen(req,timeout=100) as r:data=r.read(30_000_000)
 if len(data)<expected:raise ValueError('File too small '+url)
 return data
files=[]
for name,page,filename,author,use in SOURCES:
 url='https://opengameart.org/sites/default/files/'+filename
 try:
  b=get(url,1400)
  if filename.endswith('.zip') and not zipfile.is_zipfile(io.BytesIO(b)):raise ValueError('bad archive')
  if filename.endswith('.flac') and b[:4]!=b'fLaC':raise ValueError('not lossless FLAC')
  if filename.endswith('.ogg') and b[:4]!=b'OggS':raise ValueError('not OGG')
  f=DEST/filename;f.write_bytes(b)
  rec={'filename':filename,'category':use,'author':author,'upstream_license':'CC0-1.0','source_page':page,'source_url':url,
       'size':len(b),'sha256':hashlib.sha256(b).hexdigest(),'status':'ORIGINAL_RECORDING_OR_USER_SUPPLIED_SOUND_SOURCE','historic_authenticity':'not verified'}
  if filename.endswith('.zip'):
   with zipfile.ZipFile(io.BytesIO(b)) as z:rec['archive_members']=[m.filename for m in z.infolist() if not m.is_dir()]
  files.append(rec)
  print('SOURCE_OK',filename,len(b),flush=True)
 except Exception as e:
  print('SOURCE_FAILED',filename,str(e),flush=True)
  files.append({'filename':filename,'status':'FAILED','error':str(e),'source_page':page})
(DEST/'MANIFEST.json').write_text(json.dumps({'assets':files,'notice':'Use only individually verified CC0 originals. War horns are composed music not authentic cornu recordings.'},indent=2)+'\n')
if sum(x.get('status','')=='ORIGINAL_RECORDING_OR_USER_SUPPLIED_SOUND_SOURCE' for x in files)<4:raise SystemExit('Too few actual source files downloaded')
