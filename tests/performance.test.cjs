const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { profile } = require('../dist/performance.js');

test('automatic quality starts conservatively on touch devices and reduces load for large layouts', () => {
  assert.deepEqual(profile('auto', true, 1, false), { quality: 'low', width: 384, fps: 20, automatic: true });
  assert.deepEqual(profile('auto', false, 1, false), { quality: 'balanced', width: 512, fps: 24, automatic: true });
  assert.deepEqual(profile('auto', true, 6, false), { quality: 'low', width: 256, fps: 20, automatic: true });
  assert.deepEqual(profile('auto', false, 1, true), { quality: 'low', width: 256, fps: 16, automatic: true });
});

test('explicit quality stays predictable and invalid saved settings safely use automatic quality', () => {
  assert.deepEqual(profile('high', true, 6, true), { quality: 'high', width: 768, fps: 24, automatic: false });
  assert.deepEqual(profile('balanced', true, 6, true), { quality: 'balanced', width: 512, fps: 24, automatic: false });
  assert.deepEqual(profile('low', false, 6, true), { quality: 'low', width: 384, fps: 20, automatic: false });
  assert.deepEqual(profile('old-setting', true, 1, false), profile('auto', true, 1, false));
});

function rendererFixture() {
  const stats = { draws: 0, clears: 0, masks: 0, lastDetail: null, allocations: 0 };
  const container = {
    style: {}, children: [],
    appendChild(node) {
      this.children = this.children.filter(child => child !== node);
      this.children.push(node); node.parent = this; return node;
    },
    insertBefore(node, next) {
      if (node === next) return node;
      this.children = this.children.filter(child => child !== node);
      const index = next ? this.children.indexOf(next) : this.children.length;
      this.children.splice(index, 0, node); node.parent = this; return node;
    }
  };
  const context = vm.createContext({
    document: {
      createElement(tag) {
        assert.equal(tag, 'canvas');
        stats.allocations++;
        const canvasContext = new Proxy({}, {
          get(target, name) {
            if (name in target) return target[name];
            return () => {
              if (name === 'clearRect') stats.clears++;
              if (name === 'createLinearGradient' || name === 'createRadialGradient') {
                stats.masks++; return { addColorStop() {} };
              }
            };
          }
        });
        return { style: {}, width: 0, height: 0, setAttribute() {}, getContext: () => canvasContext,
          remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); } };
      }
    },
    HauntScenes: { draw(c, scene, time, width, height, options) { stats.draws++; stats.lastDetail = options.detail; } }
  });
  context.window = context;
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/vendor/perspective-transform.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist/renderer.js'), 'utf8'), context);
  const renderer = new context.HauntRenderer(container);
  renderer.resize(1024, 640);
  const surface = id => ({ id, name: id, scene: 'nebula', points: [[.1,.1],[.9,.1],[.9,.9],[.1,.9]], opacity: 1, feather: .12, shape: 'quad', speed: .7, visible: true });
  return { renderer, container, stats, surface };
}

test('paused scene and calibration redraws are cached while mapping and opacity still update', () => {
  const { renderer, stats, surface } = rendererFixture();
  const s = surface('a');
  renderer.setSurfaces([s]); renderer.render(5, false);
  const initialTransform = renderer.records.a.canvas.style.transform;
  const initialMasks = stats.masks;
  renderer.render(5, false);
  assert.equal(stats.draws, 1);
  s.opacity = .4; s.points[0] = [.2, .2]; renderer.render(5, false);
  assert.equal(stats.draws, 1);
  assert.equal(renderer.records.a.canvas.style.opacity, '0.4');
  assert.notEqual(renderer.records.a.canvas.style.transform, initialTransform);
  assert.equal(stats.masks, initialMasks);
  renderer.render(5, true);
  const gridClears = stats.clears;
  renderer.render(8, true);
  assert.equal(stats.clears, gridClears, 'calibration grid ignores animated time');
  s.name = 'Renamed surface'; renderer.render(8, true);
  assert.equal(stats.clears, gridClears + 1, 'grid label changes invalidate cache');
  renderer.render(8, false);
  assert.equal(stats.draws, 2, 'leaving calibration restores the scene');
});

test('scene, mask, detail and source-resolution changes repaint a paused frame', () => {
  const { renderer, stats, surface } = rendererFixture();
  const s = surface('a'); renderer.sourceWidth = 384;
  renderer.setSurfaces([s]); renderer.render(5, false);
  s.scene = 'caustics'; renderer.render(5, false);
  s.feather = .25; renderer.render(5, false);
  s.shape = 'ellipse'; renderer.render(5, false);
  assert.equal(stats.draws, 4);
  renderer.quality = 'low'; renderer.render(5, false);
  assert.equal(stats.draws, 5);
  assert.equal(stats.lastDetail, 'low');
  renderer.sourceWidth = 256; renderer.render(5, false);
  assert.equal(stats.draws, 6);
  assert.equal(renderer.records.a.canvas.width, 256);
  assert.equal(renderer.records.a.canvas.height, 160);
});

test('hidden and fully transparent surfaces do no drawing work and resume correctly', () => {
  const { renderer, stats, surface } = rendererFixture();
  const s = surface('a'); renderer.setSurfaces([s]); renderer.render(1, false);
  s.visible = false; renderer.render(2, false);
  assert.equal(stats.draws, 1);
  assert.equal(renderer.records.a.canvas.style.display, 'none');
  s.visible = true; s.opacity = 0; renderer.render(3, false);
  assert.equal(stats.draws, 1);
  s.opacity = 1; renderer.render(3, false);
  assert.equal(stats.draws, 2);
  assert.equal(renderer.records.a.canvas.style.display, 'block');
});

test('imported surface ordering is respected without reallocating existing canvases', () => {
  const { renderer, stats, surface, container } = rendererFixture();
  const a = surface('a'), b = surface('b'), c = surface('c');
  renderer.setSurfaces([a,b,c]);
  const allocations = stats.allocations;
  renderer.setSurfaces([c,b,a]);
  assert.deepEqual(container.children, [renderer.records.c.canvas, renderer.records.b.canvas, renderer.records.a.canvas]);
  assert.equal(stats.allocations, allocations);
  renderer.setSurfaces([b]);
  assert.deepEqual(container.children, [renderer.records.b.canvas]);
  assert.equal(renderer.records.a, undefined);
  renderer.destroy();
  assert.equal(container.children.length, 0);
});
