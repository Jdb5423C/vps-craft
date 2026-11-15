import re, os, json, urllib.request, urllib.parse, collections
OUT = "mirror"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"}
BASE = "https://vps-craft.com"

# 1) contamination check: what did we save under /go/, /zh/ etc?
for fam in ["go", "zh", "en-us", "de", "store", "products", "billing"]:
    d = os.path.join(OUT, fam)
    if os.path.isdir(d):
        subs = os.listdir(d)
        n = sum(1 for s in subs if os.path.exists(os.path.join(d, s, "index.html")))
        # first line of one sample
        samp = ""
        for s in subs:
            fp = os.path.join(d, s, "index.html")
            if os.path.exists(fp):
                samp = open(fp, encoding="utf-8", errors="replace").read(200).replace("\n", " ")
                break
        print(f"{fam}: dirs={len(subs)} saved={n} sample={samp[:150]}")

# 2) no-redirect status per family using pending list
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None
opener = urllib.request.build_opener(NoRedirect)

def check(path):
    req = urllib.request.Request(BASE + urllib.parse.quote(path), headers=UA)
    try:
        r = opener.open(req, timeout=25)
        return path, r.status, ""
    except urllib.error.HTTPError as e:
        return path, e.code, e.headers.get("Location", "")
    except Exception as e:
        return path, type(e).__name__, ""

pend = json.load(open("pending_sample.json", encoding="utf-8")) if os.path.exists("pending_sample.json") else []
fams = collections.defaultdict(list)
for p in pend:
    fams[p.split("/")[1] if p != "/" else "(root)"].append(p)
for fam in ["provider", "compare", "combo", "docs", "region", "news", "deal", "use-case", "line", "tools", "tier", "budget", "guides", "go", "store", "products", "billing", "zh", "en-us", "de"]:
    plist = fams.get(fam, [])[:4]
    if not plist:
        print(fam, "-> none pending"); continue
    res = [check(p) for p in plist]
    print(fam, [(p.split("/")[-1][:20], code, loc[:60]) for p, code, loc in res])
