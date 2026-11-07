import os, re, glob
from PIL import Image
from common import OUT
sizes = {f: Image.open(os.path.join(OUT, 'images', f)).size for f in os.listdir(os.path.join(OUT, 'images'))}
def fix(m):
    tag = m.group(0)
    if ' width=' in tag: return tag
    src = re.search(r'src="images/([^"]+)"', tag)
    if not src or src.group(1) not in sizes: return tag
    w, h = sizes[src.group(1)]
    return tag[:-1] + f' width="{w}" height="{h}">'
for p in glob.glob(os.path.join(OUT, '*.html')):
    s = open(p, encoding='utf-8').read()
    s2 = re.sub(r'<img [^>]*src="images/[^"]+"[^>]*>', fix, s)
    open(p, 'w', encoding='utf-8').write(s2)
print('sizes added')
