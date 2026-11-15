"""Step 5: verify mirror integrity — resolve every internal link/attr to a local file, list misses."""
import os, re, posixpath, json, random

OUT = "mirror"
local_files = set()
for root, dirs, files in os.walk(OUT):
    for f in files:
        local_files.add(os.path.relpath(os.path.join(root, f), OUT).replace(os.sep, "/"))

html_files = [rel for rel in local_files if rel.endswith(".html")]
print("html pages:", len(html_files), "total files:", len(local_files))

attr_re = re.compile(r'\b(?:href|src|poster|data-src)="([^"]+)"')
srcset_re = re.compile(r'\b(?:srcset)="([^"]+)"')

missing = {}
external = {}
resolved = 0
for rel in html_files:
    d = posixpath.dirname(rel) or ""
    text = open(os.path.join(OUT, rel), encoding="utf-8", errors="replace").read()
    # protect script blocks (JSON-LD etc) from link extraction
    text_wo = re.sub(r"<script\b.*?</script>", "", text, flags=re.I | re.S)
    vals = set(attr_re.findall(text_wo))
    for ss in srcset_re.findall(text_wo):
        for part in ss.split(","):
            u = part.strip().split(" ")[0]
            if u:
                vals.add(u)
    for v in vals:
        v = v.split("#")[0]
        if not v or v.startswith(("mailto:", "tel:", "javascript:", "data:")):
            continue
        if v.startswith("https://vps-craft.com/go/") or v.startswith("/go/"):
            resolved += 1  # intentional: live affiliate redirect kept absolute
            continue
        if v.startswith("/"):
            # root-relative that survived rewrite -> check mapping
            p = v.split("?")[0]
            cand = "index.html" if p in ("", "/") else (p[1:] if posixpath.splitext(p)[1] else p[1:] + "/index.html")
            if cand not in local_files:
                missing.setdefault(v, []).append(rel)
            else:
                resolved += 1
            continue
        if v.startswith(("http://", "https://", "//")):
            u = v
            if u.startswith("//"):
                u = "https:" + u
            ext_root = re.match(r"https?://([^/]+)", u).group(1)
            if ext_root != "vps-craft.com":
                external.setdefault(ext_root, 0)
                external[ext_root] += 1
            else:
                missing.setdefault(v, []).append(rel)
            continue
        # relative
        rp = posixpath.normpath(posixpath.join(d, v.split("?")[0])) if posixpath.dirname(v.split("?")[0]) == "" else posixpath.normpath(posixpath.join(d, v.split("?")[0]))
        rp = posixpath.normpath(posixpath.join(d, v.split("?")[0].split("#")[0]))
        if rp.endswith("/"):
            rp += "index.html"
        if rp in local_files:
            resolved += 1
        elif rp + "/index.html" in local_files:
            resolved += 1
        else:
            missing.setdefault(v, []).append(rel)

print(f"resolved={resolved} missing_kinds={len(missing)} external_hosts={len(external)}")
print("--- top external hosts ---")
for h, n in sorted(external.items(), key=lambda x: -x[1])[:15]:
    print(f"{n:7d}  {h}")
print("--- missing (first 40 kinds) ---")
for v, where in list(missing.items())[:40]:
    print(f"{v}  (in {len(set(where))} pages, e.g. {where[0]})")
json.dump({k: sorted(set(v))[:5] for k, v in missing.items()}, open("verify_missing.json", "w"), ensure_ascii=False, indent=1)
json.dump(external, open("verify_external.json", "w"), ensure_ascii=False, indent=1)
