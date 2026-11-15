"""Step 2: BFS crawl all HTML pages of vps-craft.com, discover assets. Polite concurrent fetch."""
import urllib.request, urllib.parse, re, json, os, time, threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import Counter

BASE = "https://vps-craft.com"
OUT = "mirror"
HDRS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
}
ASSET_EXT = re.compile(r"\.(js|css|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|json|xml|txt|webmanifest|map)$", re.I)
NOISE_PREFIX = ("/assets/", "/fonts/", "/images/", "/img/", "/og/", "/provider-favicons/", "/icons/", "/audio/", "/video/")

seen = set()          # normalized page paths
seen_lock = threading.Lock()
assets = set()        # asset paths (root-relative)
pages_ok = {}         # path -> bytes fetched
errors = {}           # path -> error string
start_time = time.time()

def norm(path):
    p = path.split("?")[0].split("#")[0]
    if not p.startswith("/"):
        p = "/" + p
    if len(p) > 1:
        p = p.rstrip("/")
    return p or "/"

def to_abs(base_path, href):
    """resolve href found on page base_path -> root-relative path, or None if external."""
    href = href.strip()
    if not href or href.startswith(("mailto:", "tel:", "javascript:", "data:", "#")):
        return None
    if href.startswith("//"):
        if href.startswith("//" + urllib.parse.urlparse(BASE).netloc):
            href = "https:" + href
        else:
            return None
    if href.startswith("http://") or href.startswith("https://"):
        u = urllib.parse.urlparse(href)
        if u.netloc != urllib.parse.urlparse(BASE).netloc:
            return None
        return u.path
    # relative to page dir
    from_dir = os.path.dirname(base_path) or "/"
    return urllib.parse.urljoin(from_dir + "/", href)

def fetch(path):
    url = BASE + urllib.parse.quote(path)
    req = urllib.request.Request(url, headers=HDRS)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:
            code = getattr(e, "code", None)
            if code in (404, 410):
                raise
            if code in (429, 503):
                time.sleep(2 + 4 * attempt)
                continue
            time.sleep(1 + attempt)
    raise RuntimeError("retries exhausted")

def extract_links(html, page_path):
    """returns (page_links, asset_links)"""
    plinks, alinks = set(), set()
    for m in re.findall(r'(?:href|src|action|data-src|content)="([^"]+)"', html):
        p = to_abs(page_path, m)
        if p is None:
            continue
        p = norm(p)
        if ASSET_EXT.search(p) or p.startswith(NOISE_PREFIX) or p in ("/rss.xml", "/atom.xml", "/sitemap.xml", "/manifest.webmanifest", "/robots.txt"):
            alinks.add(p)
        else:
            plinks.add(p)
    # srcset entries
    for ss in re.findall(r'srcset="([^"]+)"', html):
        for part in ss.split(","):
            u = part.strip().split(" ")[0]
            p = to_abs(page_path, u)
            if p:
                alinks.add(norm(p))
    return plinks, alinks

def save_as_page(path, data):
    if path == "/":
        fp = os.path.join(OUT, "index.html")
    else:
        fp = os.path.join(OUT, path.lstrip("/").replace("/", os.sep), "index.html")
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, "wb").write(data)

def save_as_file(path, data):
    fp = os.path.join(OUT, path.lstrip("/").replace("/", os.sep))
    os.makedirs(os.path.dirname(fp) or ".", exist_ok=True)
    open(fp, "wb").write(data)

def process_page(path):
    try:
        data, ctype = fetch(path)
    except Exception as e:
        with seen_lock:
            errors[path] = str(e)[:200]
        return [], [], path, 0
    pages_ok[path] = len(data)
    text = data.decode("utf-8", "replace")
    is_html = ("html" in ctype or "xml" in ctype) or text.lstrip()[:15].lower().startswith("<!doctype html")
    if is_html and len(text) > 500 and ASSET_EXT.search(path) is None:
        save_as_page(path, data)
        new_pages, new_assets = [], []
        pl, al = extract_links(text, path)
        with seen_lock:
            for a in al:
                if a not in assets:
                    assets.add(a)
                    new_assets.append(a)
            for p in pl:
                if p not in seen:
                    seen.add(p)
                    new_pages.append(p)
        return new_pages, new_assets, path, len(data)
    else:
        # non-html payload (json/js/txt) or tiny page: store under its own path
        save_as_file(path, data)
        return [], [], path, len(data)

def main():
    os.makedirs(OUT, exist_ok=True)
    seeds = json.load(open("urls_sitemap.json"))
    with seen_lock:
        for s in seeds:
            seen.add(norm(s))
    queue = list(sorted(seen))
    processed = 0
    MAXP = 12
    with ThreadPoolExecutor(max_workers=MAXP) as ex:
        pending = set()
        it = iter(queue)
        futures = {}
        def submit(p):
            futures[ex.submit(process_page, p)] = p
        for p in queue:
            submit(p)
        done = 0
        while futures:
            for fut in as_completed(list(futures.keys()), timeout=600):
                futures.pop(fut, None)
                done += 1
                np, na, path, size = fut.result()
                processed += 1
                for p in np:
                    submit(p)
            if done % 100 == 0 and done:
                print(f"[{time.time()-start_time:6.0f}s] pages={processed} queue_pending={len(futures)} assets={len(assets)}", flush=True)
    stats = {"pages": processed, "assets": len(assets), "errors": len(errors), "seconds": round(time.time()-start_time,1)}
    json.dump(stats, open("crawl_stats.json", "w"))
    json.dump(sorted(assets), open("assets_discovered.json", "w"), ensure_ascii=False)
    json.dump(errors, open("crawl_errors.json", "w"), ensure_ascii=False, indent=1)
    print("DONE", stats)
    c = Counter(p.split("/")[1] if p.count("/") else "(root)" for p in pages_ok)
    for k, v in c.most_common(50):
        print(f"{v:6d}  /{k}")

main()
