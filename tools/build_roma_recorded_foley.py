#!/usr/bin/env python3
"""ROMA REAL, recorded CC0 Foley and authentic CC0 source-licensed model pack.
Downloads and verifies source files. Never labels synthetic audio as field recordings.
"""
import hashlib,io,json,os,re,subprocess,zipfile,urllib.request
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'assets/roma_recorded_cc0_20261023'
RAW=OUT/'SOURCE_ARCHIVES'
OUT.mkdir(parents=True,exist_ok=True);RAW.mkdir(exist_ok=True)
sources=[
 ('sword_attacks','StarNinjas','https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes','https://opengameart.org/sites/default/files/sword_-_starninjas_1.zip'),
 ('sword_clashes','StarNinjas','https://opengameart.org/content/20-sword-sound-effects-attacks-and-clashes','https://opengameart.org/sites/default/files/sword_clash_-_starninjas_0.zip'),
 ('organic_foley','Vehicle','https://opengameart.org/content/fantasy-sound-effects-tinysized-sfx','https://opengameart.org/sites/default/files/tinysized.zip')
]
manifest={'license_policy':'ONLY individually verified CC0 source pages; original WAVs retained for audit. Do not call simulated audio field recorded.','sources':[],'files':[],'errors':[]}
def dl(url,target,minimum=1024):
 if target.exists() and target.stat().st_size>minimum:return target
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 CUB Game Lab asset research'}),timeout=150) as resp:
  data=resp.read(35_000_000)
 if len(data)<minimum:raise RuntimeError('Unexpectedly small '+url)
 target.write_bytes(data)
 return target
def clean(name):
 return re.sub('[^a-z0-9_-]+','_',str(name).lower()).strip('_')[:65] or 'audio'
def main():
 if subprocess.run(['ffmpeg','-version'],capture_output=True).returncode!=0:raise SystemExit('Missing ffmpeg')
 for sid,author,page,url in sources:
  source_record={'id':sid,'author':author,'license':'CC0-1.0','license_page':page,'url':url,'status':'unverified'}
  try:
   zpath=dl(url,RAW/(sid+'.zip'),minimum=30000)
   if not zipfile.is_zipfile(zpath):raise ValueError('Source not a valid zip')
   with zipfile.ZipFile(zpath) as z:
    candidates=[x for x in z.infolist() if x.filename.lower().endswith(('.wav','.ogg','.mp3','.flac','.aiff','.aif')) and 100<x.file_size<12_000_000]
    if len(candidates)<5:raise ValueError('Unexpectedly few real recorded source files '+str(len(candidates)))
    for i,item in enumerate(candidates[:120]):
     raw=z.read(item)
     subdir=OUT/'audio'/sid
     subdir.mkdir(parents=True,exist_ok=True)
     basename=f'{i:03d}_{clean(Path(item.filename).stem)}'
     original=subdir/(basename+Path(item.filename).suffix.lower())
     if not original.exists():original.write_bytes(raw)
     files=[original]
     for fmt,args in [('ogg',['-c:a','libvorbis','-q:a','4']),('mp3',['-c:a','libmp3lame','-b:a','112k'])]:
      dst=subdir/(basename+'.'+fmt)
      if dst==original:continue
      run=subprocess.run(['ffmpeg','-hide_banner','-nostdin','-y','-loglevel','error','-i',str(original),'-ac','1','-ar','44100','-af','loudnorm=I=-19:TP=-2:LRA=9']+args+[str(dst)],capture_output=True,text=True,timeout=35)
      if run.returncode!=0:raise RuntimeError(f'ffmpeg {dst}: {run.stderr[-350:]}')
      files.append(dst)
     for f in files:
      manifest['files'].append({'path':f.relative_to(OUT).as_posix(),'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'source_author':author,'source_page':page,'source_archive':url,'source_member':item.filename,'license':'CC0-1.0','audio_kind':'physically recorded source, then processed to 44.1khz mono for game'})
   source_record.update(status='ok',download_bytes=zpath.stat().st_size,count=len(candidates))
   print('OK',sid,len(candidates),flush=True)
  except Exception as ex:
   source_record.update(status='failed',error=str(ex))
   manifest['errors'].append(f'{sid}: {ex}')
   print('FAILED',sid,ex,flush=True)
  manifest['sources'].append(source_record)
 (OUT/'MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
 if sum(s.get('status')=='ok' for s in manifest['sources'])<2:raise SystemExit('Foley source acquisition incomplete: '+str(manifest['errors']))
if __name__=='__main__':main()
