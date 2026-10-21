const test = require('node:test');
const assert = require('node:assert/strict');
require('../dist/scenes.js');
const scenes = globalThis.HauntScenes;

function canvasProbe() {
  let depth = 0;
  let operations = 0;
  const gradient = { addColorStop(offset) { assert.ok(offset >= 0 && offset <= 1); } };
  const context = new Proxy({}, {
    get(target, name) {
      if (name in target) return target[name];
      return (...args) => {
        operations++;
        args.forEach(value => { if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: finite coordinate`); });
        if (name === 'save') depth++;
        if (name === 'restore') { depth--; assert.ok(depth >= 0, 'balanced canvas state'); }
        if (name === 'arc') assert.ok(args[2] >= 0, 'nonnegative circle radius');
        if (name === 'ellipse') assert.ok(args[2] >= 0 && args[3] >= 0, 'nonnegative ellipse radii');
        if (name === 'createRadialGradient') assert.ok(args[2] >= 0 && args[5] >= 0, 'nonnegative gradient radii');
        if (name === 'createRadialGradient' || name === 'createLinearGradient') return gradient;
      };
    },
    set(target, name, value) {
      if (name === 'globalAlpha') assert.ok(Number.isFinite(value) && value >= 0 && value <= 1, 'valid opacity');
      target[name] = value;
      return true;
    }
  });
  return { context, get operations() { return operations; }, get depth() { return depth; } };
}

test('24 distinct scenes preserve the original collection and add 10 orientation-neutral choices', () => {
  const ids = scenes.catalog.map(scene => scene.id);
  assert.equal(ids.length, 24);
  assert.equal(new Set(ids).size, ids.length);
  ['ghosts', 'bats', 'eyes', 'pumpkin', 'windows', 'fog', 'vines', 'web', 'embers', 'portal', 'stars', 'graveyard', 'cauldron', 'candles'].forEach(id => assert.ok(ids.includes(id)));
  const neutral = scenes.catalog.filter(scene => scene.orientation === 'any');
  assert.equal(neutral.length, 10);
  neutral.forEach(scene => assert.equal(scene.category, 'Any orientation'));
});

test('every scene draws finite geometry with balanced canvas state at each detail setting', () => {
  for (const scene of scenes.catalog) for (const detail of ['low', 'balanced', 'high']) for (const time of [0, 4, 133.7]) {
    const probe = canvasProbe();
    scenes.draw(probe.context, scene.id, time, 384, 240, { detail });
    assert.equal(probe.depth, 0, scene.id);
    assert.ok(probe.operations > 8, scene.id);
    assert.ok(probe.operations < 20000, `${scene.id}: bounded drawing work`);
  }
});

test('low detail reduces drawing work for every new orientation-neutral scene', () => {
  for (const scene of scenes.catalog.filter(scene => scene.orientation === 'any')) {
    const low = canvasProbe(), high = canvasProbe();
    scenes.draw(low.context, scene.id, 4, 384, 240, { detail: 'low' });
    scenes.draw(high.context, scene.id, 4, 384, 240, { detail: 'high' });
    assert.ok(low.operations < high.operations, scene.id);
  }
});
