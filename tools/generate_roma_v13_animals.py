import bpy,math,json,hashlib
from pathlib import Path
from mathutils import Vector
BASE=Path(__file__).resolve().parents[1]/'assets/roma_v13_animals'
BASE.mkdir(parents=True,exist_ok=True)
PALETTE={'skin':(0.34,0.32,0.29,1),'underside':(0.46,0.42,0.36,1),'ivory':(.83,.78,.60,1),'eye':(.035,.028,.025,1),'camel':(.56,.37,.21,1),'camel_dark':(.31,.20,.13,1),'leather':(.21,.11,.07,1),'cloth':(.55,.18,.15,1),'wood':(.42,.25,.11,1),'bronze':(.61,.43,.20,1)}
def mat(n):
 x=bpy.data.materials.get(n)
 if x:return x
 x=bpy.data.materials.new(n);x.diffuse_color=PALETTE[n];return x
def setup():
 bpy.ops.wm.read_factory_settings(use_empty=True)
def uv(name,loc,sc,seg=16,rings=8,region='skin'):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc)
 o=bpy.context.object;o.name=name;o.scale=sc
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 o.data.materials.append(mat(region))
 return o
def cone(name,loc,r1,r2,depth,vertices=12,region='ivory',rot=None):
 bpy.ops.mesh.primitive_cone_add(vertices=vertices,radius1=r1,radius2=r2,depth=depth,location=loc)
 o=bpy.context.object;o.name=name
 if rot:o.rotation_euler=rot;bpy.ops.object.transform_apply(location=False,rotation=True,scale=False)
 o.data.materials.append(mat(region));return o
def cuboid(name,loc,scale,region='wood'):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat(region));return o
def rig(name,bones):
 bpy.ops.object.armature_add(enter_editmode=True)
 a=bpy.context.object;a.name=name+'_RIG'
 e=a.data.edit_bones
 if len(e):e.remove(e[0])
 for label,tail,parent in bones:
  b=e.new(label);b.head=tail[0];b.tail=tail[1]
  if parent:b.parent=e[parent]
 bpy.ops.object.mode_set(mode='OBJECT')
 return a
def skin_to(obj,arm,bone):
 group=obj.vertex_groups.new(name=bone)
 group.add(list(range(len(obj.data.vertices))),1.0,'REPLACE')
 mod=obj.modifiers.new('ARMATURE_SKIN','ARMATURE');mod.object=arm
 obj.parent=arm
def key(pose,name,frame,rot):
 bone=pose.bones.get(name)
 if bone:
  bone.rotation_mode='XYZ'
  bone.rotation_euler=rot
  bone.keyframe_insert(data_path='rotation_euler',frame=frame)
def action(arm,label,frames,patterns):
 a=bpy.data.actions.new(label);arm.animation_data_create();arm.animation_data.action=a
 for frame,angles in patterns:
  for b in arm.pose.bones:
   val=angles.get(b.name,(0.,0.,0.))
   key(arm.pose,b.name,frame,val)
 if arm.animation_data.nla_tracks is None: raise ValueError('No NLA')
 track=arm.animation_data.nla_tracks.new();track.name=label
 start=frames[0];strip=track.strips.new(label,start,a);strip.action_frame_start=frames[0];strip.action_frame_end=frames[1]
 arm.animation_data.action=None
 for b in arm.pose.bones:b.rotation_mode='XYZ';b.rotation_euler=(0,0,0)
 return a
def fps_stats(name,arm,elephant,howdah=False):
 objects=[o for o in bpy.data.objects if o.type=='MESH']
 tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
 bones=len(arm.data.bones)
 clips=[track.name for track in arm.animation_data.nla_tracks]
 quality='STAGING' if elephant or True else 'STAGING'
 print('QA',name,'tris',tris,'bones',bones,'clips',clips,flush=True)
 expected=(3000,5000) if elephant else (1500,2500)
 if tris>expected[1]:
  ratio=(expected[1]-180)/tris
  for ob in objects:
   if len(ob.data.polygons)>90:
    bpy.context.view_layer.objects.active=ob
    dec=ob.modifiers.new('CUB_MESH_TRIANGLE_BUDGET','DECIMATE')
    dec.ratio=max(.30,min(.99,ratio))
    dec.use_collapse_triangulate=True
    bpy.ops.object.modifier_apply(modifier=dec.name)
  tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
  print('BUDGET_DECIMATE',name,tris,flush=True)
  if tris>expected[1]:
   for ob in objects:
    if len(ob.data.polygons)>45:
     bpy.context.view_layer.objects.active=ob
     dec=ob.modifiers.new('CUB_BUDGET_FINAL','DECIMATE')
     dec.ratio=(expected[1]-220)/tris
     dec.use_collapse_triangulate=True
     bpy.ops.object.modifier_apply(modifier=dec.name)
   tris=sum(sum(len(p.vertices)-2 for p in o.data.polygons) for o in objects)
   print('BUDGET_FINAL',name,tris,flush=True)
 if not expected[0]<=tris<=expected[1]:raise RuntimeError(f'{name}: triangle budget failure {tris} (target {expected})')
 outfile=BASE/(name+'.glb')
 bpy.ops.export_scene.gltf(filepath=str(outfile),export_format='GLB',
  export_yup=True,export_skins=True,export_animations=True,export_nla_strips=True,
  export_materials='EXPORT')
 if outfile.read_bytes()[:4]!=b'glTF':raise ValueError('Invalid exported binary glTF')
 info={'name':name,'file':outfile.name,'triangles':tris,'bones':bones,'clips':clips,
  'license':'Original CUB Game Lab procedural / proprietary IP','source':'tools/generate_roma_v13_animals.py',
  'bytes':outfile.stat().st_size,'sha256':hashlib.sha256(outfile.read_bytes()).hexdigest(),
  'format':'GLB','up_axis':'Y','unit':'metre','animation_method':'Bone rotation NLA Actions',
  'quality':'ANIMATED_PROTOTYPE_NOT_YET_APPROVED_PRODUCTION',
  'limitations':'No real-animal mocap, gait silhouette and skin deformation require gameplay QC'}
 return info
def world_elephant(howdah=False):
 name='CUB_ROMA_WAR_ELEPHANT_HOWDAH' if howdah else 'CUB_ROMA_WAR_ELEPHANT_BARE'
 setup()
 bones=[('Root',((0,0,1.5),(0,0,1.8)),None),('Torso',((0,0,1.8),(0,-.3,1.85)),'Root'),
 ('Head',((0,-1.05,2.05),(0,-1.3,2.05)),'Torso'),('Ear_L',((-.47,-1.02,2.13),(-.67,-1.02,2.13)),'Head'),
 ('Ear_R',((.47,-1.02,2.13),(.67,-1.02,2.13)),'Head'),
 ('Trunk1',((0,-1.4,1.95),(0,-1.64,1.60)),'Head'),
 ('Trunk2',((0,-1.64,1.60),(0,-1.73,1.21)),'Trunk1'),
 ('Trunk3',((0,-1.73,1.21),(0,-1.85,.85)),'Trunk2'),('Tail',((0,1.17,1.84),(0,1.42,1.12)),'Torso')]
 for side,x in [('L',-.64),('R',.64)]:
  for row,y in [('F',-.75),('B',.91)]:
   bones += [(f'{side}{row}_Upper',((x,y,1.50),(x,y,.77)),'Torso'),(f'{side}{row}_Lower',((x,y,.78),(x,y,.13)),f'{side}{row}_Upper')]
 a=rig(name,bones);parts=[]
 def add(o,bone):skin_to(o,a,bone);parts.append(o)
 add(uv('main_body',(0,.02,1.87),(.98,1.38,.82),24,16), 'Torso')
 add(uv('head',(0,-1.21,2.1),(.65,.64,.57),20,12),'Head')
 add(uv('forehead',(0,-1.49,2.13),(.49,.38,.40),16,10), 'Head')
 for side,x in [('L',-.56),('R',.56)]:
  add(uv(f'ear_{side}',(x,-1.15,2.21),(.41,.12,.52),16,10,region='underside'),'Ear_'+side)
  add(uv(f'eye_{side}',(x*.93,-1.55,2.30),(.065,.045,.053),10,6,'eye'),'Head')
  for row,y in [('F',-.77),('B',.89)]:
   add(uv(f'upperleg_{side}{row}',(x,y,1.07),(.295,.32,.65),16,10),f'{side}{row}_Upper')
   add(uv(f'lowerleg_{side}{row}',(x,y,.42),(.265,.27,.40),14,8),f'{side}{row}_Lower')
   add(uv(f'foot_{side}{row}',(x,y-.13,.15),(.35,.40,.18),14,8,region='underside'),f'{side}{row}_Lower')
 for i,(center,sc,bone) in enumerate([
  ((0,-1.63,1.69),(.31,.27,.43),'Trunk1'),((0,-1.76,1.25),(.245,.255,.39),'Trunk2'),((0,-1.84,.87),(.19,.21,.30),'Trunk3')
 ]):add(uv('trunk_'+str(i),center,sc,14,9),bone)
 add(uv('tail',(0,1.42,1.37),(.08,.11,.40),10,7),'Tail')
 for x in [-.39,.39]:
  add(cone('tusk',(x,-1.79,1.72),.12,.015,.65,12,'ivory',rot=(math.pi/2.4,0,0)),'Head')
 if howdah:
  for x in [-.47,.47]:
   for y in [-.40,.5]:
    add(cuboid('tower_post',(x,y,2.79),(.075,.075,.77),'wood'),'Torso')
  add(cuboid('howdah_floor',(0,.07,2.48),(1.20,1.32,.14),'wood'),'Torso')
  for y in [-.56,.60]:add(cuboid('parapet',(0,y,2.93),(1.2,.08,.35),'wood'),'Torso')
  for x in [-.55,.55]:add(cuboid('parapet',(x,.07,2.93),(.08,1.2,.35),'wood'),'Torso')
 N=36
 def rotations(t,kind):
  A={}
  amp={'Idle':.025,'Walk':.24,'Charge':.40,'Trample':.35,'Hit':.35,'Death':.55}[kind]
  for s in ['L','R']:
   for row in ['F','B']:
    phase=(0 if (s=='L')==(row=='F') else math.pi)
    if kind in ('Walk','Charge','Trample'):
     ang=amp*math.sin(2*math.pi*t+phase)
     A[f'{s}{row}_Upper']=(ang,0,0)
     A[f'{s}{row}_Lower']=(max(0,-ang)*.55,0,0)
    elif kind=='Death':A[f'{s}{row}_Upper']=(-.6*t,0,.25 if s=='L' else -.25)
  if kind in ('Walk','Charge','Trample','Idle'):
   A['Trunk1']=(.1*math.sin(t*math.tau),0,0);A['Trunk2']=(.15*math.sin(t*math.tau+.4),0,0)
  if kind=='Trample':A['Trunk1']=(.38*math.sin(t*math.tau),0,0)
  if kind=='Hit':A['Head']=(.15*math.sin(t*math.pi),0,.2*math.sin(t*math.pi))
  if kind=='Death':A['Torso']=(.45*t,0,.35*t);A['Head']=(.27*t,0,0);A['Trunk1']=(.5*t,0,0)
  return A
 for kind in ['Idle','Walk','Charge','Trample','Hit','Death']:
  pats=[(1,rotations(0,kind)),(12,rotations(.333,kind)),(24,rotations(.667,kind)),(36,rotations(1 if kind not in ('Death','Hit') else .92,kind))]
  action(a,kind,(1,36),pats)
 bpy.ops.wm.save_as_mainfile(filepath=str(BASE/(name+'.blend')))
 return fps_stats(name,a,True,howdah)
def camel():
 name='CUB_ROMA_DROMEDARY_RIGGED'
 setup()
 bones=[('Root',((0,0,1.23),(0,0,1.5)),None),('Torso',((0,.0,1.51),(0,-.2,1.53)),'Root'),
 ('Neck',((0,-.76,1.63),(0,-1.10,1.98)),'Torso'),
 ('Head',((0,-1.12,2.13),(0,-1.42,2.20)),'Neck'),('Tail',((0,.99,1.45),(0,1.28,1.17)),'Torso')]
 for side,x in [('L',-.31),('R',.31)]:
  for row,y in [('F',-.65),('B',.68)]:
   bones += [(f'{side}{row}_Upper',((x,y,1.32),(x,y,.75)),'Torso'),(f'{side}{row}_Lower',((x,y,.76),(x,y,.12)),f'{side}{row}_Upper')]
 a=rig(name,bones);parts=[]
 def add(o,bone):skin_to(o,a,bone);parts.append(o)
 add(uv('body',(0,0,1.55),(.45,1.04,.48),18,10,'camel'),'Torso')
 add(uv('hump',(0,.18,1.94),(.34,.57,.44),14,9,'camel_dark'),'Torso')
 add(uv('neck',(0,-.88,1.85),(.25,.35,.64),14,8,'camel'),'Neck')
 add(uv('face',(0,-1.36,2.23),(.21,.34,.23),12,8,'camel'),'Head')
 add(uv('muzzle',(0,-1.66,2.11),(.19,.20,.14),10,7,'camel_dark'),'Head')
 for x in [-.15,.15]:add(uv('camel_ear',(x,-1.22,2.42),(.09,.07,.16),9,6,'camel'),'Head')
 for side,x in [('L',-.33),('R',.33)]:
  for row,y in [('F',-.60),('B',.65)]:
   add(uv(f'upper_{side}{row}',(x,y,.93),(.15,.17,.44),13,7,'camel'),'{}_{}_Upper'.format(side,row).replace('_','',1) if False else f'{side}{row}_Upper')
   add(uv(f'lower_{side}{row}',(x,y,.37),(.12,.135,.36),12,6,'camel'),'{}_{}_Lower'.format(side,row).replace('_','',1) if False else f'{side}{row}_Lower')
   add(uv('foot',(x,y-.06,.11),(.20,.22,.13),12,6,'camel_dark'),f'{side}{row}_Lower')
 add(uv('tail',(0,1.12,1.20),(.055,.065,.34),9,6,'camel_dark'),'Tail')
 add(cuboid('rider_saddle',(0,-.1,2.04),(.58,.56,.105),'leather'),'Torso')
 add(cuboid('saddle_guide',(0,-.13,2.18),(.35,.25,.19),'cloth'),'Torso')
 def rot(t,kind):
  v={};amp={'Idle':.01,'Walk':.26,'Run':.49,'Hit':.07,'Death':.6}[kind]
  for side in ['L','R']:
   for row in ['F','B']:
    phase=0 if (side=='L')==(row=='F') else math.pi
    if kind in ('Walk','Run'):
     ang=amp*math.sin(2*math.pi*t+phase);v[f'{side}{row}_Upper']=(ang,0,0);v[f'{side}{row}_Lower']=(max(0,-ang)*.50,0,0)
    if kind=='Death':v[f'{side}{row}_Upper']=(-.45*t,0,.2 if side=='L' else -.2)
  if kind=='Idle':v['Neck']=(.02*math.sin(2*math.pi*t),0,0)
  if kind=='Hit':v['Neck']=(.18*math.sin(math.pi*t),0,.12)
  if kind=='Death':v['Torso']=(.5*t,0,.25*t);v['Neck']=(.35*t,0,0)
  return v
 for kind in ['Idle','Walk','Run','Hit','Death']:
  action(a,kind,(1,36),[(1,rot(0,kind)),(12,rot(.33,kind)),(24,rot(.67,kind)),(36,rot(.98,kind))])
 bpy.ops.wm.save_as_mainfile(filepath=str(BASE/(name+'.blend')))
 return fps_stats(name,a,False)
records=[]
for f in [lambda:world_elephant(False),lambda:world_elephant(True),camel]:
 try:records.append(f())
 except Exception as e:print('ANIMAL_FAILED',str(e),flush=True);raise
(BASE/'MANIFEST.json').write_text(json.dumps({'assets':records,'source_type':'CUB original generated 2026-10-23','quality':'prototype before gameplay animation and mesh preview'},indent=2)+'\n')
print('ANIMALS_COMPLETE',len(records),flush=True)
