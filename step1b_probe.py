import urllib.request, re, json
BASE = "https://vps-craft.com"
HDRS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36"}

def get(path):
    req = urllib.request.Request(BASE + path, headers=HDRS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

for p in ["/provider/racknerd", "/rss.xml", "/manifest.webmanifest"]:
    try:
        t = get(p)
        open("sample" + p.replace("/", "_"), "w", encoding="utf-8").write(t)
        print(p, len(t))
    except Exception as e:
        print("FAIL", p, e)

t = open("sample_provider_racknerd", encoding="utf-8").read()
# what internal links does a provider page contain?
links = set(re.findall(r'href="(/[^"#?]*)"', t))
print("internal hrefs:", len(links))
deals = sorted(l for l in links if l.startswith("/deal/"))[:10]
print("deal links sample:", deals)
guides = sorted(l for l in links if l.startswith("/guides/"))[:10]
print("guide links sample:", guides)
# check runtime fetch patterns in inline scripts / json state
for pat in ["__INITIAL_STATE__", "application/json", "/api/", "fetch(", "sw.js", "serviceWorker"]:
    print(pat, "->", t.count(pat))
