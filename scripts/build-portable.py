#!/usr/bin/env python3
"""Build one offline HTML file from reviewed app assets; no external runtime."""
from pathlib import Path
import base64
import re
ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'

def build():
    html = (DIST / 'index.html').read_text()
    html = html.replace('<html lang="en">', '<html lang="en" data-portable="true">')
    html = re.sub(r'<link rel="manifest"[^>]*>', '', html)
    for filename, mime in [('icon.svg', 'image/svg+xml'), ('icon-180.png', 'image/png')]:
        data = base64.b64encode((DIST / filename).read_bytes()).decode()
        html = html.replace('href="' + filename + '"', 'href="data:' + mime + ';base64,' + data + '"')
    css = (DIST / 'style.css').read_text()
    if '</style' in css.lower():
        raise ValueError('Unexpected style terminator')
    html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + css + '</style>')
    def script(match):
        path = (DIST / match.group(1)).resolve()
        if DIST.resolve() not in path.parents:
            raise ValueError('Script outside app')
        js = path.read_text()
        if re.search(r'</script', js, re.I):
            raise ValueError('Unexpected script terminator')
        return '<script>\n' + js + '\n</script>'
    html = re.sub(r'<script src="([^"]+)"></script>', script, html)
    html = html.replace('</head>', '<script>window.HAUNTLIGHT_PORTABLE=true;</script></head>')
    # Keep license notices in every redistributed standalone copy.
    notices = (ROOT / 'LICENSE').read_text() + '\n\nThird-party perspective-transform:\n' + (DIST / 'vendor/LICENSE-perspective-transform.txt').read_text()
    html = html.replace('</body>', '<!--\n' + notices.replace('--', '—') + '\n-->\n</body>')
    return html

if __name__ == '__main__':
    out = DIST / 'downloads/Hauntlight.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(build())
    print(out)
