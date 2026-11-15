import re, os, collections, json
t = open("mirror/index.html", encoding="utf-8", errors="replace").read()
blocks = re.findall(r"<script[^>]*type=\"application/(?:ld\+)?json\"[^>]*>(.*?)</script>", t, re.S)
print("json script blocks:", len(blocks), [len(b) for b in blocks][:8])
allslugs = set()
for b in blocks:
    allslugs |= set(re.findall(r"/deal/([A-Za-z0-9\-_.]+)", b))
print("deal slugs across embedded json:", len(allslugs))
# also whole html
html_slugs = set(re.findall(r"/deal/([A-Za-z0-9\-_.]+)", t))
print("deal slugs in whole home html:", len(html_slugs))
disk = set(os.listdir("mirror/deal")) if os.path.isdir("mirror/deal") else set()
print("deal dirs on disk:", len(disk))
missing = sorted(html_slugs - disk)
print("missing:", len(missing), missing[:10])
# provider pages slugs count on disk
print("provider dirs:", len(os.listdir("mirror/provider")) if os.path.isdir("mirror/provider") else 0)
# sample of what disk deals contain vs home (sanity)
print("home slugs sample:", sorted(html_slugs)[:6])
