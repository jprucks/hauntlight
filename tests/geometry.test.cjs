const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({console});
context.window = context;
vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/vendor/perspective-transform.js'), 'utf8'), context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/renderer.js'), 'utf8'), context);
const {validQuad, matrix} = context.HauntGeometry;
const unit = [[0,0],[1,0],[1,1],[0,1]];
function apply(m,x,y) { const d=m[3]*x+m[7]*y+m[15]; return [(m[0]*x+m[4]*y+m[12])/d,(m[1]*x+m[5]*y+m[13])/d]; }
function close(a,b) { assert.ok(Math.abs(a-b)<0.02, `${a} should equal ${b}`); }
test('rectangular output preserves all source corners at Epson 1280 by 800', () => {
 const m=matrix(unit,1280,800,512,320); assert.ok(m);
 [[0,0],[512,0],[512,320],[0,320]].forEach((p,i)=> { const q=apply(m,...p);close(q[0],unit[i][0]*1280);close(q[1],unit[i][1]*800); });
});
test('off-axis convex quads map all four corners with perspective division', () => {
 const quads=[[[.1,.1],[.9,.2],[.7,.9],[.2,.7]],[[.4,.01],[.6,.01],[.95,.95],[.05,.95]],[[.3,.2],[.7,.3],[.8,.6],[.1,.9]]];
 quads.forEach(p=> {const m=matrix(p,1024,768,384,240);assert.ok(m); [[0,0],[384,0],[384,240],[0,240]].forEach((a,i)=> { const b=apply(m,...a);close(b[0],p[i][0]*1024);close(b[1],p[i][1]*768); }); });
});
test('intersecting, collinear and tiny polygons are rejected before homography',()=>{
 [ [[0,0],[1,1],[1,0],[0,1]], [[0,0],[.5,0],[1,0],[0,1]], [[0,0],[1,0],[.2,.2],[0,1]], [[0,0],[.0001,0],[.0001,.0001],[0,.0001]] ].forEach(p=>{assert.equal(validQuad(p),false);assert.equal(matrix(p,1280,800,512,320),null);});
});
test('malformed and nonfinite imports are safely rejected',()=>{
 [null,[],[[0,0],[1,0],[1,1],[NaN,1]],[[0,0],[1,0],[1,1],[0,Infinity]],[[0,0],[1,0],[1,1],['0',1]]].forEach(p=>assert.equal(validQuad(p),false));
 assert.equal(matrix(unit,0,800,512,320),null);assert.equal(matrix(unit,1280,800,-1,320),null);
});
test('projective lines remain straight through mapped midpoint',()=>{
 const m=matrix([[.1,.1],[.9,.2],[.7,.9],[.2,.7]],1280,800,512,320);
 const a=apply(m,0,160),b=apply(m,256,160),c=apply(m,512,160);
 close((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]),0);
});
test('viewport resizing scales output without altering normalized calibration',()=>{
 const p=[[.1,.1],[.9,.2],[.7,.9],[.2,.7]], a=apply(matrix(p,640,400,512,320),100,100),b=apply(matrix(p,1280,800,512,320),100,100);
 close(b[0],a[0]*2);close(b[1],a[1]*2);
});
