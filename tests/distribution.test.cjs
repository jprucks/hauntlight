const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.join(__dirname, '..');
const python = process.platform === 'win32' ? 'python' : 'python3';
const html = execFileSync(python, ['-c', "import runpy; print(runpy.run_path('scripts/build-portable.py')['build']())"], {cwd: root, encoding:'utf8'});
test('portable HTML has no external runtime assets and preserves embedded notices', () => {
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link\b[^>]*rel="(?:stylesheet|manifest)"/i);
  for (const m of html.matchAll(/<style>([\s\S]*?)<\/style>/gi)) assert.doesNotMatch(m[1], /@import\b|url\s*\(/i);
  for (const m of html.matchAll(/<link\b[^>]*href="([^"]+)"/gi)) assert.ok(m[1].startsWith('data:'), m[1]);
  assert.match(html, /Copyright \(c\) 2026 Jason Rucks/);
  assert.match(html, /Copyright \(c\) 2015 Jenny Louthan/);
  assert.match(html, /window.HAUNTLIGHT_PORTABLE=true/);
  assert.doesNotMatch(html, /appgprj_|siwc_bypass|github_pat_/);
});
test('all inline scripts parse and bundled scene catalog retains every scene', () => {
  const context = vm.createContext({console}); context.window=context;
  let scripts=0;
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/gi)) {
    const script = new vm.Script(m[1]); scripts++;
    // The app needs a DOM; standalone libraries should initialize without one.
    if(!m[1].includes('document.getElementById')) script.runInContext(context);
  }
  assert.equal(scripts,7);
  assert.equal(context.HauntScenes.catalog.length,24);
  assert.equal(context.HauntScenes.catalog.filter(x=>x.orientation==='any').length,10);
  assert.equal(context.HAUNTLIGHT_PORTABLE,true);
});
