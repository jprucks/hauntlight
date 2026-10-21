#!/usr/bin/env python3
"""Produce a secret-free source distribution; exclude Git and hosting identity."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent.parent
out = root / 'dist/downloads/hauntlight-v1.1.0.zip'
out.parent.mkdir(exist_ok=True)
with ZipFile(out, 'w', ZIP_DEFLATED) as z:
    for p in sorted(root.rglob('*')):
        rel = p.relative_to(root)
        if not p.is_file() or any(x in rel.parts for x in ['.git', '.openai', 'node_modules', 'downloads', '__pycache__']):
            continue
        if p.name.startswith('.env') or p.suffix in ['.log', '.tar', '.gz']:
            continue
        z.write(p, Path('hauntlight') / rel)
print(out)
