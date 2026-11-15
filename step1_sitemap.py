"""Step 1: collect URL list from sitemap.xml (+ optional atom.xml) for vps-craft.com."""
import urllib.request, xml.etree.ElementTree as ET, re, json, sys

BASE = "https://vps-craft.com"
HDRS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"}

def get(url):
    req = urllib.request.Request(url, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

urls = set()
data = get(BASE + "/sitemap.xml")
root = ET.fromstring(data)
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
for loc in root.findall(".//s:loc", ns):
    u = loc.text.strip()
    urls.add(u)
# fallback regex if namespace issue
if not urls:
    for m in re.findall(r"<loc>(.*?)</loc>", data.decode("utf-8")):
        urls.add(m.strip())

print("sitemap URLs:", len(urls))
# normalize: strip trailing slash except root, drop query
norm = set()
for u in urls:
    p = u[len(BASE):] if u.startswith(BASE) else "/"
    p = p.split("?")[0].split("#")[0]
    if not p.startswith("/"): p = "/" + p
    if len(p) > 1: p = p.rstrip("/")
    if not p: p = "/"
    norm.add(p)

# also include well-known extras
for extra in ["/rss.xml", "/atom.xml", "/manifest.webmanifest", "/favicon.svg", "/sitemap.xml", "/robots.txt"]:
    norm.add(extra)

paths = sorted(norm)
json.dump(paths, open("urls_sitemap.json", "w"), ensure_ascii=False, indent=1)
print("normalized paths:", len(paths))
# group by first segment
from collections import Counter
c = Counter(p.split("/")[1] if p.count("/") >= 1 and p != "/" else "(root)" for p in paths)
for k, v in c.most_common(40):
    print(f"{v:6d}  /{k}")
