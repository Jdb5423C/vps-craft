import re, os, json, urllib.request, urllib.parse, collections, posixpath
from concurrent.futures import ThreadPoolExecutor

BASE = "https://vps-craft.com"
OUT = "mirror"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"}
ASSET_EXT = re.compile(r"\.(js|css|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|json|xml|txt|webmanifest|map)$", re.I)
NOISE_PREFIX = ("/assets/", "/fonts/", "/images/", "/img/", "/og/", "/provider-favicons/", "/icons/", "/audio/", "/video/")

def norm(path):
    p = path.split("?")[0].split("#")[0]
    if not p.startswith("/"): p = "/" + p
    if len(p) > 1: p = p.rstrip("/")
    return p or "/"

def to_abs(base_path, href):
    href = href.strip()
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "data:", "#")): return None
    if href.startswith("//"):
        if href.startswith("//vps-craft.com"): href = "https:" + href
        else: return None
    if href.startswith("http://") or href.startswith("https://"):
        u = urllib.parse.urlparse(href)
        if u.netloc != "vps-craft.com": return None
        return u.path
    from_dir = posixpath.dirname(base_path) or "/"
    return posixpath.normpath(posixpath.join(from_dir, href.lstrip("./") if href.startswith("./") else href)) if not href.startswith("/") else href

visited = set()
for root, dirs, files in os.walk(OUT):
    for f in files:
        if f == "index.html":
            rel = os.path.relpath(os.path.join(root, f), OUT).replace(os.sep, "/")
            p = "/" if rel == "index.html" else "/" + rel[: -len("/index.html")]
            visited.add(norm(p))
discovered = set()
for p in sorted(visited):
    if p == "/": fp = os.path.join(OUT, "index.html")
    else: fp = os.path.join(OUT, p.lstrip("/").replace("/", os.sep), "index.html")
    if not os.path.exists(fp): continue
    text = open(fp, encoding="utf-8", errors="replace").read()
    vals = re.findall(r'(?:href|src|action|data-src|content|data-href)="([^"]+)"', text)
    for m in vals:
        ap = to_abs(p, m)
        if ap is None: continue
        ap = norm(ap)
        if ASSET_EXT.search(ap) or ap.startswith(NOISE_PREFIX): continue
        discovered.add(ap)
pending = sorted(discovered - visited)
print("pending:", len(pending))
by_first = collections.Counter(p.split("/")[1] if p != "/" else "(root)" for p in pending)
print(by_first.most_common(20))
json.dump(pending, open("pending_sample.json", "w", encoding="utf-8"), ensure_ascii=False)

def check(p):
    try:
        r = urllib.request.urlopen(urllib.request.Request(BASE + urllib.parse.quote(p), headers=UA), timeout=30)
        d = r.read()
        return p, r.status, len(d)
    except Exception as e:
        return p, getattr(e, "code", type(e).__name__), 0

# sample 120 across the pending list
sample = pending[:: max(1, len(pending)//120)][:120]
codes = collections.Counter()
fail_samples = collections.defaultdict(list)
with ThreadPoolExecutor(max_workers=8) as ex:
    for p, code, size in ex.map(check, sample):
        codes[code] += 1
        if code != 200:
            fail_samples[code].append(p)
print("sample codes:", codes)
for k, v in fail_samples.items():
    print(k, v[:8])
