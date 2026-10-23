#!/usr/bin/env python3
"""Quick resilient original CC0 zip harvesting (no APT, no audio processing)."""
from pathlib import Path
from urllib.request import urlopen,Request
import json,hashlib,zipfile
OUT=Path(__file__).resolve().parents[1]/'assets/roma_raw_cc0_sources';OUT.mkdir(parents=True,exist_ok=True)
S=[
('sword_attacks.zip','https://opengameart.org/sites/default/files/sword_-_starninjas_1.zip','StarNinjas','https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes'),
('sword_clashes.zip','https://opengameart.org/sites/default/files/sword_clash_-_starninjas_0.zip','StarNinjas','https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes'),
('organic_foley.zip','https://opengameart.org/sites/default/files/tinysized.zip','Vehicle','https://opengameart.org/content/fantasy-sound-effects-tinysized-sfx'),
('human_voice_kenney.zip','https://opengameart.org/sites/default/files/kenney_voiceoverFighter.zip','Kenney','https://opengameart.org/content/voiceover-pack-fighter-40-taunts'),
('elephant_lowpoly_original.blend','https://opengameart.org/sites/default/files/elephant-lowpoly.blend','syncopika','https://opengameart.org/content/low-poly-elephant-model')]
records=[]
for name,url,author,evidence in S:
 try:
  raw=urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (CUB ROMA research; CC0-source verification)'}),timeout=120).read(32_000_000)
  if len(raw)<1000:raise Exception('too small')
  if name.endswith('.zip') and not zipfile.is_zipfile(__import__('io').BytesIO(raw)):raise Exception('not zip')
  if name.endswith('.blend') and not raw.startswith(b'BLENDER'):raise Exception('not Blender source')
  (OUT/name).write_bytes(raw)
  rec={'file':name,'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'author':author,'source':url,'license_page':evidence,'license':'CC0-1.0','status':'acquired'}
  print('OK',name,len(raw),flush=True)
 except Exception as e:
  rec={'file':name,'status':'failed','error':str(e)};print('FAIL',name,e,flush=True)
 records.append(rec)
(OUT/'MANIFEST.json').write_text(json.dumps({'policy':'Original source files CC0 verified per linked upstream pages. Source archive is not re-licensable.', 'items':records},indent=2)+'\n')
if sum(x['status']=='acquired' for x in records)<3:raise SystemExit('Too few real asset sources')
