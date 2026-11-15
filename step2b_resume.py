"""Step 2b: RESUMABLE crawler. Rebuild visited from disk, rescan saved HTML for links, BFS until no new pages."""
import urllib.request, urllib.parse, re, json, os, time, threading
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://vps-craft.com"
OUT = "mirror"
HDRS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}
ASSET_EXT = re.compile(r"\.(js|css|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|json|xml|txt|webmanifest|map)$", re.I)
NOISE_PREFIX = ("/assets/", "/fonts/", "/images/", "/img/", "/og/", "/provider-favicons/", "/icons/", "/audio/", "/video/")

visited = set()      # page paths already saved on disk (normalized)
fetched = set()      # all page paths we have requested/saved
assets = set()       # asset root-relative paths
errors = {}
lock = threading.Lock()
start_time = time.time()

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
        if href.startswith("//vps-craft.com"):
            href = "https:" + href
        else:
            return None
    if href.startswith("http://") or href.startswith("https://"):
        u = urllib.parse.urlparse(href)
        if u.netloc != "vps-craft.com":
            return None
        return u.path
    from_dir = os.path.dirname(base_path) or "/"
    return urllib.parse.urljoin(from_dir + "/", href)

def extract_links(text, page_path):
    plinks, alinks = set(), set()
    for m in re.findall(r'(?:href|src|action|data-src|content|data-href)="([^"]+)"', text):
        p = to_abs(page_path, m)
        if p is None:
            continue
        p = norm(p)
        if ASSET_EXT.search(p) or p.startswith(NOISE_PREFIX):
            alinks.add(p)
        else:
            plinks.add(p)
    for ss in re.findall(r'srcset="([^"]+)"', text):
        for part in ss.split(","):
            p = to_abs(page_path, part.strip().split(" ")[0])
            if p:
                alinks.add(norm(p))
    return plinks, alinks

def fetch(path):
    url = BASE + urllib.parse.quote(path)
    req = urllib.request.Request(url, headers=HDRS)
    last = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:
            last = e
            code = getattr(e, "code", None)
            if code in (404, 410):
                raise
            time.sleep(2 + 3 * attempt)
    raise last

def process_page(path):
    """download+save+extract; returns list of freshly discovered page paths."""
    with lock:
        visited.add(path)
    try:
        data, ctype = fetch(path)
    except Exception as e:
        with lock:
            errors[path] = str(e)[:150]
        return []
    text = data.decode("utf-8", "replace")
    looks_html = text.lstrip()[:15].lower().startswith("<!doctype html") or text.lstrip()[:6].lower() == "<html "
    if looks_html and ASSET_EXT.search(path) is None:
        if path == "/":
            fp = os.path.join(OUT, "index.html")
        else:
            fp = os.path.join(OUT, path.lstrip("/").replace("/", os.sep), "index.html")
        os.makedirs(os.path.dirname(fp), exist_ok=True)
        open(fp, "wb").write(data)
        pl, al = extract_links(text, path)
        with lock:
            assets.update(al)
            fresh = [p for p in pl if p not in visited]
            visited.update(fresh)
        return fresh
    # non-html payload saved by its own path
    fp = os.path.join(OUT, path.lstrip("/").replace("/", os.sep))
    os.makedirs(os.path.dirname(fp) or ".", exist_ok=True)
    open(fp, "wb").write(data)
    return []

def rebuild_from_disk():
    """visited from saved pages; assets from saved files; returns (pages set discovered from saved html links)."""
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
        if n % 300 == 0:
            print(f"  rescanning disk pages {n}/{len(pages_on_disk)}", flush=True)
        text = open(fp, encoding="utf-8", errors="replace").read()
        pl, al = extract_links(text, p)
        discovered |= pl
        assets.update(al)
    return discovered

def main():
    seeds = json.load(open("urls_sitemap.json"))
    for s in seeds:
        visited.add(norm(s))  # tentative; rebuild will confirm actual presence
    visited.clear()
    discovered = rebuild_from_disk()
    fetched.update(visited)
    pending = sorted(discovered - visited)
    print(f"resume: on-disk pages={len(visited)} pending={len(pending)} assets={len(assets)}", flush=True)
    processed = 0
    with ThreadPoolExecutor(max_workers=12) as ex:
        rnd = 0
        while pending:
            rnd += 1
            print(f"--- BFS round {rnd}: {len(pending)} pages ---", flush=True)
            futures = {ex.submit(process_page, p): p for p in pending}
            fresh_next = set()
            done = 0
            for fut in as_completed(futures):
                fresh_next.update(fut.result())
                done += 1
                processed += 1
                if done % 200 == 0:
                    print(f"[{time.time()-start_time:6.0f}s] processed={processed} disk_pages={len(visited)} fresh_next={len(fresh_next)} assets={len(assets)} errors={len(errors)}", flush=True)
            pending = sorted(fresh_next)
    print(f"FINISH processed={processed} pages_on_disk={len(visited)} assets={len(assets)} errors={len(errors)} secs={time.time()-start_time:.0f}", flush=True)
    json.dump(sorted(assets), open("assets_discovered.json", "w"), ensure_ascii=False)
    json.dump(errors, open("crawl_errors.json", "w"), ensure_ascii=False, indent=1)

main()
