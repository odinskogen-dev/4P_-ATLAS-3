#!/usr/bin/env python3
"""RUN INSIDE BLENDER: CC0 UBC male decimation preserving animation armature, vertex weights, and original GLB animation clips.
No Mixamo. Actual geometry decimation (not bone scaling or metadata edits).
"""
import bpy, bmesh, json, math, os, sys, struct, hashlib, zipfile, io, urllib.request, shutil
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
OUT=BASE/'assets/roma_real_ubc_optimized'
OUT.mkdir(parents=True,exist_ok=True)
SRC_URL='https://raw.githubusercontent.com/programasweights/avatar/main/public/assets/character.glb'
src=OUT/'UBC_CC0_Original_Fullbody.glb'
def dl(url):
 with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'CUB-ROMA-open-CC0-source/2026'}),timeout=180) as r: return r.read(65_000_000)
src.write_bytes(dl(SRC_URL))
if src.read_bytes()[:4]!=b'glTF':raise ValueError('Invalid original GLB')
records=[]
def triangles():
 return sum(len(p.vertices)-2 for o in bpy.data.objects if o.type=='MESH' for p in o.data.polygons)
def stats(target):
 objs=[x for x in bpy.data.objects if x.type=='MESH']; arm=[x for x in bpy.data.objects if x.type=='ARMATURE']
 return {'triangles':triangles(),'mesh_count':len(objs),'armatures':len(arm),'bones':len(arm[0].data.bones) if arm else 0,
         'weighted_meshes':sum(1 for o in objs if len(o.vertex_groups)>0),'mesh_names':[o.name for o in objs],
         'animation_actions':len(bpy.data.actions),'target_triangles':target}
def clean_scene():bpy.ops.wm.read_factory_settings(use_empty=True)
for goal in [2500,700]:
 clean_scene()
 bpy.ops.import_scene.gltf(filepath=str(src))
 before=stats(goal)
 if before['bones']!=65:raise ValueError('Original lost rig bones: '+str(before))
 meshes=[o for o in bpy.data.objects if o.type=='MESH']
 for o in meshes:
  if o.data.shape_keys:
   o.shape_key_clear()
  if not o.vertex_groups:
   # Separate eyeball meshes in the source may be unweighted; bind explicitly to the head.
   arm=next(a for a in bpy.data.objects if a.type=='ARMATURE')
   grp=o.vertex_groups.new(name='Head')
   grp.add(list(range(len(o.data.vertices))),1.0,'REPLACE')
   if not any(x.type=='ARMATURE' for x in o.modifiers):
    mod=o.modifiers.new('CUB_HEAD_RIG','ARMATURE');mod.object=arm
   print('RIGGED UNWEIGHTED PART',o.name,'verts',len(o.data.vertices),flush=True)
 total=triangles()
 ratio=goal/max(total,1)
 # Weight reduction by same ratio across meshes: preserve original face/body triangle proportions.
 for o in meshes:
  bpy.context.view_layer.objects.active=o
  o.select_set(True)
  old=sum(len(p.vertices)-2 for p in o.data.polygons)
  mod=o.modifiers.new('CUB_REAL_LOD_DECIMATION','DECIMATE')
  mod.decimate_type='COLLAPSE'
  mod.ratio=max(0.008,min(1.0,ratio))
  mod.use_collapse_triangulate=True
  bpy.ops.object.modifier_apply(modifier=mod.name)
  o.select_set(False)
 after=stats(goal)
 actual=after['triangles']
 if actual>goal*1.12:
  print('EXCEEDS BUDGET '+str(actual)+' > '+str(goal)+'; performing corrective decimation',flush=True)
  ratio2=(goal/actual)*0.98
  for o in meshes:
   bpy.context.view_layer.objects.active=o
   mod=o.modifiers.new('CUB_CORRECTIVE_DECIMATE','DECIMATE')
   mod.ratio=max(0.01,min(1.0,ratio2))
   mod.use_collapse_triangulate=True
   bpy.ops.object.modifier_apply(modifier=mod.name)
  after=stats(goal);actual=after['triangles']
 if not (goal*.65<=actual<=goal*1.11):raise ValueError(f'Incorrect geometry target {goal}: {actual}')
 if after['bones']!=65 or after['weighted_meshes']!=len(meshes):raise ValueError('Skin/rig lost in decimation')
 # Blender GLTF exporter knows asset Y-up; asset imported already uses normalized metered Quaternius rig.
 opts={'filepath':str(OUT/f'ROMA_UbcMale_LOD_{goal}tris_65bones_RIGGED.glb'),
       'export_format':'GLB','export_yup':True,'export_skins':True,'export_animations':True,
       'export_materials':'EXPORT','export_extras':True}
 supported=bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
 if 'export_animation_mode' in supported:opts['export_animation_mode']='ACTIONS'
 if 'export_nla_strips' in supported:opts['export_nla_strips']=False
 print('EXPORT OPTIONS',opts,'supported version',bpy.app.version_string,flush=True)
 bpy.ops.export_scene.gltf(**opts)
 path=Path(opts['filepath'])
 if path.read_bytes()[:4]!=b'glTF':raise ValueError('Bad output GLB')
 rec={'file':path.name,'target':goal,'blender_triangles':actual,'before':before,'after':after,'source':SRC_URL,'license':'CC0-1.0',
      'license_evidence':'https://github.com/programasweights/avatar/blob/main/ASSETS.md',
      'blender_version':bpy.app.version_string,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 records.append(rec)
 print('SUCCESS',goal,'actual',actual,'bones',after['bones'],'actions',after['animation_actions'],'size',path.stat().st_size,flush=True)
(OUT/'BLENDER_DECIMATE_LOG.json').write_text(json.dumps({'records':records,'orientation_target':'glTF Y-up; metre units; verify feet/world scale in game with QA report','warning':'Do not assume Source version UAL animations included; only free standard packs available.'},indent=2)+'\n')
