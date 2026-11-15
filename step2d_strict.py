"""Step 2d: STRICT-extractor resumable crawler.
Fixes: content= meta text no longer parsed as URL; /go/ affiliate redirects excluded and recorded for absolute rewrite.
Follows /page/N pagination links like normal pages. 12 workers, max 2 attempts.
"""
import urllib.request, urllib.parse, re, json, os, time, threading, shutil
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://vps-craft.com"
OUT = "mirror"
HDRS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}
ASSET_EXT = re.compile(r"\.(js|css|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|json|xml|txt|webmanifest|map|avif|gif)$", re.I)
NOISE_PREFIX = ("/assets/", "/fonts/", "/images/", "/img/", "/og/", "/provider-favicons/", "/icons/", "/audio/", "/video/")
SANE_PATH = re.compile(r"^/[A-Za-z0-9\-_.~/]+$")
MAX_LEN = 180

visited = set()
assets = set()
go_links = set()
errors = {}
lock = threading.Lock()
t0 = time.time()

def norm(path):
    p = path.split("?")[0].split("#")[0]
    if not p.startswith("/"): p = "/" + p
    if len(p) > 1: p = p.rstrip("/")
    return p or "/"

def to_abs(base_path, href):
    href = href.strip()
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "data:", "#")):
        return None
    if href.startswith("//"):
        href = ("https:" + href) if href.startswith("//vps-craft.com") else None
        if href is None:
            return None
    if href.startswith("http://") or href.startswith("https://"):
        u = urllib.parse.urlparse(href)
        if u.netloc != "vps-craft.com":
            return None
        return u.path
    from_dir = os.path.dirname(base_path) or "/"
    return urllib.parse.urljoin(from_dir + "/", href)

ATTR_URL = re.compile(r'(?:href|src|action|data-src|poster)="([^"]+)"')
META_CONTENT = re.compile(r'<meta[^>]+content="(https://vps-craft\.com[^"]*|/[^"]*)"')
SRCSET = re.compile(r'srcset="([^"]+)"')
JSON_URL = re.compile(r'"(?:url|sameAs|mainEntityOfPage|item)":"((?:https://vps-craft\.com)?/[^"]+)"')

def classify(ap, sink_pages, sink_assets):
    if ap is None:
        return
    ap = norm(ap)
    if len(ap) > MAX_LEN or not SANE_PATH.match(ap):
        return
    if ASSET_EXT.search(ap) or ap.startswith(NOISE_PREFIX):
        sink_assets.add(ap)
        return
    if ap.startswith("/go/"):
        sink_go.add(ap)
        return
    sink_pages.add(ap)

sink_go = go_links

def extract_links(text, page_path):
    plinks, alinks = set(), set()
    for m in ATTR_URL.findall(text):
        classify(to_abs(page_path, m), plinks, alinks)
    for m in META_CONTENT.findall(text):
        classify(to_abs(page_path, m), plinks, alinks)
    for ss in SRCSET.findall(text):
        for part in ss.split(","):
            classify(to_abs(page_path, part.strip().split(" ")[0]), plinks, alinks)
    for m in JSON_URL.findall(text):
        classify(to_abs(page_path, m), plinks, alinks)
    return plinks, alinks

def fetch(path):
    url = BASE + urllib.parse.quote(path)
    req = urllib.request.Request(url, headers=HDRS)
    last = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=35) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:
            last = e
            code = getattr(e, "code", None)
            if code in (404, 410, 403):
                raise
            time.sleep(2 + 3 * attempt)
    raise last

def process_page(path):
    with lock:
        visited.add(path)
    try:
        data, ctype = fetch(path)
    except Exception as e:
        with lock:
            errors[path] = str(e)[:120]
        return []
    text = data.decode("utf-8", "replace")
    looks_html = text.lstrip()[:15].lower().startswith("<!doctype html") or text.lstrip()[:6].lower() == "<html "
    if looks_html and ASSET_EXT.search(path) is None:
        fp = os.path.join(OUT, "index.html") if path == "/" else os.path.join(OUT, path.lstrip("/").replace("/", os.sep), "index.html")
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        open(fp, "wb").write(data)
        pl, al = extract_links(text, path)
        with lock:
            assets.update(al)
            fresh = [p for p in pl if p not in visited]
            visited.update(fresh)
        return fresh
    fp = os.path.join(OUT, path.lstrip("/").replace("/", os.sep))
    os.makedirs(os.path.dirname(fp) or ".", exist_ok=True)
    open(fp, "wb").write(data)
    return []

def rebuild_from_disk():
    pages_on_disk = []
    for root, dirs, files in os.walk(OUT):
        for f in files:
            fp = os.path.join(root, f)
            rel = os.path.relpath(fp, OUT).replace(os.sep, "/")
            if f == "index.html":
                p = "/" if rel == "index.html" else "/" + rel[: -len("/index.html")]
                visited.add(norm(p))
                pages_on_disk.append((norm(p), fp))
            elif ASSET_EXT.search(rel):
                assets.add("/" + rel)
    discovered = set()
    n = 0
    for p, fp in pages_on_disk:
        n += 1
        if n % 400 == 0:
            print(f"  rescan {n}/{len(pages_on_disk)}", flush=True)
        text = open(fp, encoding="utf-8", errors="replace").read()
        pl, al = extract_links(text, p)
        discovered |= pl
        assets.update(al)
    print(f"  disk pages={len(visited)} discovered={len(discovered)} assets={len(assets)} go={len(go_links)}", flush=True)
    return discovered

def main():
    # quarantine contaminated /go saved pages (external vendor HTML after redirect follow)
    godir = os.path.join(OUT, "go")
    if os.path.isdir(godir):
        shutil.move(godir, "_quarantine_go")
        print("moved mirror/go -> _quarantine_go", flush=True)
        visited.discard("/go")
    seeds = json.load(open("urls_sitemap.json"))
    discovered = rebuild_from_disk()
    for s in seeds:
        p = norm(s)
        if p not in visited:
            discovered.add(p)
    pending = sorted(discovered - visited)
    print(f"start: visited={len(visited)} pending={len(pending)}", flush=True)
    processed = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        rnd = 0
        while pending:
            rnd += 1
            print(f"--- round {rnd}: {len(pending)} ---", flush=True)
            futures = {ex.submit(process_page, p): p for p in pending}
            fresh_next = set()
            done = 0
            for fut in as_completed(futures):
                fresh_next.update(fut.result())
                done += 1
                processed += 1
                if done % 300 == 0:
                    print(f"[{time.time()-t0:6.0f}s] processed={processed} visited={len(visited)} fresh_next={len(fresh_next)} assets={len(assets)} errors={len(errors)}", flush=True)
            pending = sorted(fresh_next)
    print(f"FINISH processed={processed} pages_visited={len(visited)} assets={len(assets)} go_links={len(go_links)} errors={len(errors)} secs={time.time()-t0:.0f}", flush=True)
    json.dump(sorted(assets), open("assets_discovered.json", "w"), ensure_ascii=False)
    json.dump(sorted(go_links), open("go_links.json", "w"), ensure_ascii=False)
    json.dump(errors, open("crawl_errors.json", "w"), ensure_ascii=False, indent=1)

main()
