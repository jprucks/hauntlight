#!/usr/bin/env python3
"""Build portable app and allowlisted source/desktop archives, excluding host identity."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json
import runpy
ROOT = Path(__file__).resolve().parent.parent
VERSION = json.loads((ROOT / 'package.json').read_text())['version']
OUT = ROOT / 'dist/downloads'
OUT.mkdir(exist_ok=True)
portable = runpy.run_path(str(ROOT / 'scripts/build-portable.py'))['build']()
(OUT / 'Hauntlight.html').write_text(portable)
source = OUT / ('hauntlight-v' + VERSION + '.zip')
root_files = ['README.md', 'QUICKSTART.txt', 'CHANGELOG.md', 'LICENSE', 'package.json', '.gitignore']
files = [ROOT / n for n in root_files]
for folder in ['dist', 'docs', 'scripts', 'tests', '.github/workflows']:
    for p in (ROOT / folder).rglob('*'):
        rel = p.relative_to(ROOT)
        if p.is_file() and not any(x in rel.parts for x in ['downloads', '__pycache__', '.git', '.openai', 'node_modules']) and p.suffix in ['.js', '.cjs', '.mjs', '.html', '.css', '.json', '.webmanifest', '.svg', '.png', '.txt', '.md', '.py', '.sh', '.yml', '.yaml']:
            files.append(p)
with ZipFile(source, 'w', ZIP_DEFLATED) as z:
    for p in sorted(set(files)):
        if p.name.startswith('.env'):
            continue
        z.write(p, Path('hauntlight') / p.relative_to(ROOT))
    z.writestr('hauntlight/Hauntlight.html', portable)
desktop = OUT / ('Hauntlight-Desktop-v' + VERSION + '.zip')
with ZipFile(desktop, 'w', ZIP_DEFLATED) as z:
    z.writestr('Hauntlight/Hauntlight.html', portable)
    for name in ['QUICKSTART.txt', 'LICENSE']:
        z.write(ROOT / name, 'Hauntlight/' + name)
    z.write(ROOT / 'dist/vendor/LICENSE-perspective-transform.txt', 'Hauntlight/THIRD-PARTY-LICENSE.txt')
artifacts = [OUT / 'Hauntlight.html', desktop, source]
(OUT / 'SHA256SUMS.txt').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.name + '\n' for p in artifacts))
for p in artifacts:
    print(p)
