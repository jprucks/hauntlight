const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ctx = vm.createContext({console}); ctx.window = ctx;
['vendor/perspective-transform.js','renderer.js','scenes.js','state.js'].forEach(file => vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist',file),'utf8'),ctx));
const state = ctx.HauntState, scenes = Array.from(ctx.HauntScenes.catalog,s=>s.id);
const valid = data => state.validate(data, scenes, ctx.HauntGeometry.validQuad);
function layout() { return {schemaVersion:1,surfaces:[state.surface('test-1','The wall','ghosts')]}; }
function clone(x) { return JSON.parse(JSON.stringify(x)); }

test('export JSON roundtrip preserves mapping and all supported settings',()=>{
 const original=layout(); original.surfaces[0].points=[[.1,.2],[.8,.1],[.9,.9],[.2,.8]];
 Object.assign(original.surfaces[0],{opacity:0,feather:.4,speed:2,visible:false,shape:'ellipse'});
 assert.deepEqual(clone(valid(clone(original))),clone(original));
});
test('malformed layout schema and invalid surface counts are rejected',()=>{
 [null,{},[],{schemaVersion:2,surfaces:[]},{schemaVersion:1,surfaces:null},{schemaVersion:1,surfaces:[]}].forEach(x=>assert.throws(()=>valid(x)));
 const l=layout();l.surfaces=Array.from({length:7},(_,i)=>state.surface('s'+i,'Wall','ghosts'));assert.throws(()=>valid(l));
});
test('duplicate IDs and unknown scenes are rejected',()=>{
 const duplicate=layout();duplicate.surfaces.push(clone(duplicate.surfaces[0]));assert.throws(()=>valid(duplicate));
 const unknown=layout();unknown.surfaces[0].scene='untrusted-scene';assert.throws(()=>valid(unknown));
 ['',null,17,'x'.repeat(81)].forEach(id=>{const l=layout();l.surfaces[0].id=id;assert.throws(()=>valid(l));});
});
test('out-of-frame, nonfinite and intersecting corner coordinates are rejected',()=>{
 const points=[[[0,0],[1.1,0],[1,1],[0,1]],[[0,0],[1,0],[1,1],[-.1,1]],[[0,0],[1,1],[1,0],[0,1]],[[0,0],[1,0],[1,1],[0,NaN]],[[0,0],[1,0],[1,1],[0,Infinity]],[[0,0],[1,0],[1,1],[0,'1']]];
 points.forEach(p=>{const l=layout();l.surfaces[0].points=p;assert.throws(()=>valid(l));});
});
test('nonfinite and nonnumeric controls are rejected rather than poisoning rendering',()=>{
 ['opacity','feather','speed'].forEach(k=>{[NaN,Infinity,-Infinity,'1',null,undefined].forEach(v=>{const l=layout();l.surfaces[0][k]=v;assert.throws(()=>valid(l));});});
});
test('finite out-of-range controls normalize to documented safe limits',()=>{
 const l=layout();Object.assign(l.surfaces[0],{opacity:-3,feather:2,speed:99});const a=valid(l).surfaces[0];
 assert.equal(a.opacity,0);assert.equal(a.feather,.4);assert.equal(a.speed,2);
 Object.assign(l.surfaces[0],{opacity:3,feather:-1,speed:-9});const b=valid(l).surfaces[0];
 assert.equal(b.opacity,1);assert.equal(b.feather,0);assert.equal(b.speed,.1);
});
test('normalization removes unknown fields and copies corner data defensively',()=>{
 const l=layout();l.surfaces[0].name='a'.repeat(100);l.surfaces[0].script='untrusted';l.surfaces[0].shape='nonsense';
 const result=valid(l);assert.equal(result.surfaces[0].name.length,40);assert.equal(result.surfaces[0].script,undefined);assert.equal(result.surfaces[0].shape,'quad');
 result.surfaces[0].points[0][0]=.42;assert.equal(l.surfaces[0].points[0][0],.13);
});
test('every shipped scene can be persisted and six unique surfaces are accepted',()=>{
 scenes.forEach(id=>{const l=layout();l.surfaces[0].scene=id;assert.equal(valid(l).surfaces[0].scene,id);});
 const l=layout();l.surfaces=Array.from({length:6},(_,i)=>state.surface('s'+i,'Wall',scenes[i]));assert.equal(valid(l).surfaces.length,6);
});
