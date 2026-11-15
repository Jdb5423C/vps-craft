"""Step 3: download all discovered static assets (js/css/fonts/images/og/data-json)."""
import urllib.request, re, json, os, time
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE = "https://vps-craft.com"
OUT = "mirror"
HDRS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"}

assets = json.load(open("assets_discovered.json"))
print("seed assets:", len(assets))

# also scan already-downloaded JS chunks for referenced data files (e.g. /data/xx.json)
extra = set()
for root, dirs, files in os.walk(os.path.join(OUT, "assets")):
    for f in files:
        if f.endswith(".js"):
            t = open(os.path.join(root, f), encoding="utf-8", errors="replace").read()
            for m in re.findall(r'["\'`](/[A-Za-z0-9_\-./]+\.(?:json|svg|png|jpg|webp|woff2|txt|xml|webmanifest))["\'`]', t):
                extra.add(m)
# scan CSS url(...)
for root, dirs, files in os.walk(OUT):
    for f in files:
        if f.endswith(".css"):
            t = open(os.path.join(root, f), encoding="utf-8", errors="replace").read()
            for m in re.findall(r'url\((["\']?)([^)"\']+)\1\)', t):
                u = m[1]
                if u.startswith("/"):
                    extra.add(u.split("?")[0])
                elif not u.startswith(("http", "data:")):
                    # relative to css location
                    import posixpath
                    rel_dir = "/" + os.path.relpath(root, OUT).replace(os.sep, "/")
                    extra.add(posixpath.normpath(posixpath.join(rel_dir, u)).replace("\\", "/"))
extra = {e for e in extra if not e.startswith("//") and ("/" in e)}
print("extra from css/js scan:", len(extra))
todo = sorted(set(assets) | extra)

def local_path(p):
    return os.path.join(OUT, p.lstrip("/").replace("/", os.sep))

done_ok, failed = 0, {}
def dl(p):
    global done_ok
    lp = local_path(p)
    if os.path.exists(lp) and os.path.getsize(lp) > 0:
        return p, "cached"
    url = BASE + urllib.parse.quote(p)
    req = urllib.request.Request(url, headers=HDRS)
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
            os.makedirs(os.path.dirname(lp) or ".", exist_ok=True)
            open(lp, "wb").write(data)
            return p, "ok"
        except Exception as e:
            code = getattr(e, "code", None)
            if code in (404, 410):
                return p, "404"
            if code in (429, 503):
                time.sleep(3 + 5 * attempt)
                continue
            time.sleep(1 + attempt)
    return p, f"fail:{str(e)[:80]}"

import urllib.parse
t0 = time.time()
with ThreadPoolExecutor(max_workers=12) as ex:
    futs = [ex.submit(dl, p) for p in todo]
    for i, fut in enumerate(as_completed(futs)):
        p, st = fut.result()
        if st in ("ok", "cached"):
            done_ok += 1
        else:
            failed[p] = st
        if (i + 1) % 50 == 0:
            print(f"[{time.time()-t0:5.0f}s] {i+1}/{len(todo)} ok={done_ok} fail={len(failed)}", flush=True)
print(f"assets done ok={done_ok} failed={len(failed)} secs={time.time()-t0:.0f}")
json.dump(failed, open("asset_failures.json", "w"), ensure_ascii=False, indent=1)
