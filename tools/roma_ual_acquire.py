#!/usr/bin/env python3
"""Download only actual freely published official Quaternius UAL standards, and CC0 UBC source derivative.
No paid/pro/source archives, no Mixamo. Preserve the original downloaded bytes.
"""
import json, hashlib, os, time, zipfile, io, struct
from pathlib import Path
from urllib.request import urlopen, Request
P=Path(__file__).resolve().parents[1]/"assets/roma_ual_ubc"
P.mkdir(parents=True,exist_ok=True)
URLS=[
("UAL1_STANDARD_CC0.zip","https://opengameart.org/sites/default/files/universal_animation_librarystandard.zip","Quaternius","https://opengameart.org/content/universal-animation-library"),
("UAL2_STANDARD_CC0.zip","https://opengameart.org/sites/default/files/universal_animation_library_2standard.zip","Quaternius","https://opengameart.org/content/universal-animation-library-2"),
("UBC_MALE_ORIGINAL_CC0.glb","https://raw.githubusercontent.com/ilrein/warptracker/main/art/hero-ubc-wip.glb","Quaternius; mirror Warptracker","https://github.com/ilrein/warptracker/blob/main/ASSETS.md"),
]
def get(url):
 for i in range(3):
  try:
   with urlopen(Request(url,headers={"User-Agent":"Mozilla/5.0 (CUB-ROMA-QA/2026; noncommercial research of CC0 original)","Accept":"application/zip,application/octet-stream,*/*"}),timeout=140) as r:
    return r.read(130_000_000)
  except Exception as e:
   print("retry",url,i,repr(e),flush=True);time.sleep(2+i)
 raise RuntimeError("download failed "+url)
result={"assets":[],"errors":[],"note":"Source pack from OGA is free Standard ONLY, not 120+ Source/Pro pack. Do not mislabel 45 clips as 120+."}
for name,url,author,license_evidence in URLS:
 try:
  data=get(url)
  if name.endswith(".zip") and not zipfile.is_zipfile(io.BytesIO(data)):raise ValueError("Not a ZIP; possible bot/challenge page")
  if name.endswith(".glb") and data[:4]!=b"glTF":raise ValueError("Not glTF/GLB")
  out=P/name;out.write_bytes(data)
  record={"file":name,"source":url,"author":author,"license":"CC0-1.0","license_evidence":license_evidence,"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest(),"status":"downloaded"}
  if name.endswith(".zip"):
   with zipfile.ZipFile(io.BytesIO(data)) as z:
    entries=[{"name":x.filename,"bytes":x.file_size} for x in z.infolist() if not x.is_dir()]
    record["files_total"]=len(entries);record["model_files"]=[x for x in entries if x["name"].lower().endswith((".glb",".gltf",".fbx",".blend"))][:300]
    (P/(name+".contents.json")).write_text(json.dumps(entries,indent=2))
  result["assets"].append(record)
  print("OK",name,len(data),"models",len(record.get("model_files",[])),flush=True)
 except Exception as e:
  result["errors"].append({"file":name,"error":str(e)});print("FAILED",name,repr(e),flush=True)
(P/"MANIFEST.json").write_text(json.dumps(result,indent=2)+"\n")
if not any(x["file"]=="UAL1_STANDARD_CC0.zip" for x in result["assets"]):raise SystemExit("Cannot validate UAL1 source")
if not any(x["file"]=="UBC_MALE_ORIGINAL_CC0.glb" for x in result["assets"]):raise SystemExit("Missing UBC male")
