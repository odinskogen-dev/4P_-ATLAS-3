#!/usr/bin/env python3
"""ROMA expanded world: factual ancient Pleiades place candidates only.
Pleiades representative points and temporal labels are NOT exact settlement positions nor evidence for precise 264 BCE.
"""
import csv,gzip,io,json,hashlib,re,urllib.request
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'assets/roma_pleiades_candidates_20261023';OUT.mkdir(parents=True,exist_ok=True)
URL='https://atlantides.org/downloads/pleiades/dumps/pleiades-places-latest.csv.gz'
REQ=urllib.request.Request(URL,headers={'User-Agent':'CUB-ROMA-geographical-research/2026'})
with urllib.request.urlopen(REQ,timeout=250) as r:data=r.read(50_000_000)
if not data[:2]==b'\x1f\x8b':raise RuntimeError('Pleiades dump is not gzip')
(OUT/'SOURCE_SHA256.txt').write_text('Source: '+URL+'\nsha256: '+hashlib.sha256(data).hexdigest()+'\nCC BY 3.0 — Pleiades Contributors\n')
csvdata=gzip.decompress(data).decode('utf-8-sig')
rows=list(csv.DictReader(io.StringIO(csvdata)))
if not rows:raise RuntimeError('No Pleiades places read')
cols=list(rows[0]);print('PLEIADES CSV COLS',cols,flush=True)
def col(*aliases):
 for key in aliases:
  for c in cols:
   if c.lower().replace('_','').replace(' ','')==key.lower().replace('_','').replace(' ',''):return c
 return None
loncol=col('reprLong','repr_lon','longitude');latcol=col('reprLat','repr_lat','latitude')
titlecol=col('title','name');idcol=col('id','pid');periodcol=col('timePeriods','time periods','time_periods')
typecol=col('featureTypes','feature types','feature_types','placeTypes')
print('MATCHED',loncol,latcol,titlecol,idcol,periodcol,typecol,flush=True)
if not all([loncol,latcol,titlecol,idcol]):raise SystemExit('No reliable coordinate/name columns in Pleiades')
# Approximate geographic groups are not assertions about ancient peoples.
# The user's requested expansion covers significant ancient regions; temporal evidence may be broad.
def region(lat,lon):
 if 5<=lat<22 and 21<=lon<43:return 'Kush / Upper Nile / Horn of Africa'
 if 12<=lat<=31 and 39<=lon<=61:return 'South Arabia / Arabia'
 if 5<=lat<=36 and 68<=lon<=90:return 'Indian subcontinent / Mauryan sphere'
 if 22<=lat<=36 and 56<=lon<68:return 'Gedrosia / Makran'
 if 17<=lat<=32 and -20<=lon<30:return 'Western Sahara / Egyptian oases'
 return None
priority=['Meroe','Meroë','Napata','Naga','Naqa','Marib','Saba','Shabwa','Sirwah','Tamna','Qana','Baraqish','Taxila','Takshasila','Pataliputra','Mathura','Ujjain','Barygaza','Bharukaccha','Saketa','Varanasi','Pushkalavati','Patala','Zaranj','Pura','Alexandria','Siwa','Ammon','Kharga','Bactra','Sanchi']
def score(r):
 title=r[titlecol];period=r.get(periodcol,'') if periodcol else '';ptype=r.get(typecol,'') if typecol else ''
 n=title.lower()
 priority_score=sum(18 for name in priority if name.lower() in n)
 temporal=(8 if 'hellenistic' in period.lower() else 0)+(5 if 'classical' in period.lower() else 0)+(3 if 'archaic' in period.lower() else 0)
 st=(5 if any(x in ptype.lower() for x in ('settlement','urban','town','city','port','fort')) else 0)
 penalty=-6 if 'unlocated' in n or 'anonymous' in n or len(title)>60 else 0
 return priority_score+temporal+st+penalty
groups={}
for r in rows:
 try:lat=float(r[latcol]);lon=float(r[loncol])
 except Exception:continue
 if not(-20<=lon<=90 and 5<=lat<=66):continue
 reg=region(lat,lon)
 if not reg:continue
 title=r[titlecol].strip()
 if not title or len(title)>80 or title.lower().startswith(('unnamed','unlocated','unknown')):continue
 period=(r.get(periodcol,'') if periodcol else '') or ''
 if period and not any(x in period.lower() for x in ('hellenistic','classical','archaic','iron age','greek','persian','achae','early')):continue
 # Place names and representative points directly inherit authority from Pleiades.
 iid=(r[idcol] or '').strip()
 url=iid if iid.startswith('http') else ('https://pleiades.stoa.org/places/'+iid.split('/')[-1])
 if not re.search(r'/places/\d+',url):continue
 item={'pleiades_uri':url,'name':title,'longitude':round(lon,6),'latitude':round(lat,6),
 'region_group':reg,'period_tags':period,'place_type':r.get(typecol,'') if typecol else '',
 'people':'Not asserted by Pleiades representative-point CSV; needs source-specific confirmation',
 'date_264_bc_verified':False,'coordinate_kind':'Pleiades representative place-point, not necessarily settlement centre',
 'license':'CC BY 3.0','attribution':'Pleiades Contributors (pleiades.stoa.org)','score':score(r)}
 groups.setdefault(reg,[]).append(item)
counts={'Kush / Upper Nile / Horn of Africa':12,'South Arabia / Arabia':15,
 'Indian subcontinent / Mauryan sphere':18,'Gedrosia / Makran':7,'Western Sahara / Egyptian oases':5}
selected=[]
for reg,n in counts.items():
 candidates=groups.get(reg,[])
 candidates.sort(key=lambda x:(-x['score'],x['name']))
 candidates=[x for x in candidates if x['score']>=3]
 print('REGION',reg,len(candidates),'top',[(x['name'],x['period_tags']) for x in candidates[:7]],flush=True)
 selected.extend(candidates[:n])
seen=set();uniques=[]
for p in selected:
 if p['pleiades_uri'] in seen:continue
 seen.add(p['pleiades_uri']);uniques.append(p)
# 40–60 credible gazetteer entries; without sources do not invent 264 BCE period/person.
if len(uniques)<35:print('IMPORTANT: fewer than 35 scholarly candidates; deliver partial sourced set rather than inventing 264 BCE locations',flush=True)
(OUT/'PLEIADES_CANDIDATES_WITH_HISTORY_WARNINGS.json').write_text(json.dumps({'source':URL,'license':'CC BY 3.0','license_url':'https://creativecommons.org/licenses/by/3.0/',
 'history_warning':'Period tags show broad chronological range; none of these are individually verified to 264 BCE. Ancient states and peoples require scholarly review. Do not blindly import into 264 BC start.',
 'generated_candidates':len(uniques),'places':uniques},indent=2,ensure_ascii=False)+'\n')
with (OUT/'PLEIADES_CANDIDATES_WITH_HISTORY_WARNINGS.csv').open('w',newline='') as fp:
 w=csv.DictWriter(fp,fieldnames=[x for x in uniques[0] if x!='score'])
 w.writeheader();w.writerows({k:v for k,v in row.items() if k!='score'} for row in uniques)
(OUT/'MANIFEST.json').write_text(json.dumps({'source':URL,'source_sha256':hashlib.sha256(data).hexdigest(),'places':len(uniques),'region_counts':{k:sum(x['region_group']==k for x in uniques) for k in counts},
 'temporal_verified_264_bc':0,'status':'SOURCE_VERIFIED_PLACES_BUT_DATE_REQUIRES_RESEARCH','license':'CC BY 3.0'},indent=2)+'\n')
print('SUCCESS',len(uniques),flush=True)
