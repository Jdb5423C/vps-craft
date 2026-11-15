"""Step 4: rewrite downloaded mirror so internal links work offline (relative paths).

Strategy:
 - Build set of local files. Link target mapping: '/x' -> 'x/index.html', '/x/' same, root -> 'index.html', asset '/a/b.css' -> 'a/b.css'.
 - In HTML: rewrite href/src/content/data-src/poster/srcset attributes when target exists locally.
   Do NOT touch inside <script>/<style> blocks (JSON-LD and __INITIAL_STATE__ keep original domain URLs = data fidelity).
 - In CSS files: rewrite url(/...) tokens.
 - Leave external (other domain) URLs untouched.
"""
import os, re, posixpath, json

OUT = "mirror"
DOMAIN = "https://vps-craft.com"

# ---- index local files ----
local_files = set()
for root, dirs, files in os.walk(OUT):
    for f in files:
        rel = os.path.relpath(os.path.join(root, f), OUT).replace(os.sep, "/")
        local_files.add(rel)

def map_to_local(path):
    """root-relative path -> local file relpath or None."""
    p = path
    if p in ("", "/"):
        cand = "index.html"
    elif p.endswith("/"):
        cand = p.lstrip("/") + "index.html"
    else:
        pp = p.lstrip("/")
        if posixpath.splitext(pp)[1]:
            cand = pp
        else:
            cand = pp + "/index.html"
    return cand if cand in local_files else None

def rel_from(from_dir, target):
    r = posixpath.relpath(target, from_dir)
    if not r.startswith((".", "/")):
        r = "./" + r
    return r

EXT = re.compile(r"\.(css|js|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|map)(\?|#|$)", re.I)

def rewrite_attr_value(val, from_dir):
    """val: raw attribute value; returns new val or same."""
    orig = val
    if val.startswith(DOMAIN):
        val = val[len(DOMAIN):] or "/"
    elif not (val.startswith("/") and not val.startswith("//")):
        return orig
    # /go/<id> affiliate redirects: not mirrored (Cloudflare 403 for bots,
    # and target is another site). Point to the live URL so clicks still work.
    if val.startswith("/go/"):
        return DOMAIN + val
    # split query/fragment
    frag = ""
    if "#" in val:
        val, frag = val.split("#", 1)
        frag = "#" + frag
    query = ""
    if "?" in val:
        val, query = val.split("?", 1)
        query = "?" + query
    if not val:
        val = "/"
    target = map_to_local(val)
    if target is None:
        # asset that wasn't downloaded but referenced with domain -> keep domain-absolute if that's what we had?
        return orig
    r = rel_from(from_dir, target)
    return r + query + frag

def process_html_file(fp, relpath_):
    text = open(fp, encoding="utf-8").read()
    from_dir = posixpath.dirname(relpath_) or "."
    if from_dir == ".":
        from_dir = ""
    # split out script/style blocks to protect them
    parts = []
    pos = 0
    block_re = re.compile(r"<(script|style)\b.*?</\1>", re.I | re.S)
    for m in block_re.finditer(text):
        parts.append(("html", text[pos:m.start()]))
        parts.append(("block", m.group(0)))
        pos = m.end()
    parts.append(("html", text[pos:]))

    attr_re = re.compile(r'\b(href|src|poster|data-src|content|data-href)="([^"]*)"')
    srcset_re = re.compile(r'\b(srcset)="([^"]*)"')

    def fix_html(seg):
        def repl(m):
            name, val = m.group(1), m.group(2)
            if name == "content" and not (val.startswith("/") or val.startswith(DOMAIN)):
                return m.group(0)
            nv = rewrite_attr_value(val, from_dir)
            return f'{name}="{nv}"' if nv != val else m.group(0)
        seg = attr_re.sub(repl, seg)
        def repl_ss(m):
            entries = []
            for part in m.group(2).split(","):
                bits = part.strip().split(" ")
                if bits:
                    bits[0] = rewrite_attr_value(bits[0], from_dir)
                entries.append(" ".join(bits))
            return 'srcset="' + ", ".join(entries) + '"'
        seg = srcset_re.sub(repl_ss, seg)
        return seg

    def fix_css_in_block(seg):
        # only url(...) tokens in style blocks/css files
        def repl(m):
            q, u = m.group(1), m.group(2)
            nu = rewrite_attr_value(u, from_dir)
            return f"url({q}{nu}{q})"
        return re.sub(r'url\((["\']?)([^)"\']+)\1\)', repl, seg, flags=re.I)

    out = []
    for kind, seg in parts:
        if kind == "html":
            out.append(fix_html(seg))
        else:
            low = seg[:20].lower()
            if low.startswith("<style") or ('type="text/css"' in low):
                out.append(fix_css_in_block(seg))
            else:
                out.append(seg)
    new = "".join(out)
    if new != text:
        open(fp, "w", encoding="utf-8", newline="").write(new)
        return True
    return False

def process_css_file(fp, relpath_):
    text = open(fp, encoding="utf-8").read()
    from_dir = posixpath.dirname(relpath_) or ""
    def repl(m):
        q, u = m.group(1), m.group(2)
        nu = rewrite_attr_value(u, from_dir)
        return f"url({q}{nu}{q})"
    new = re.sub(r'url\((["\']?)([^)"\']+)\1\)', repl, text, flags=re.I)
    if new != text:
        open(fp, "w", encoding="utf-8", newline="").write(new)
        return True
    return False

changed = {"html": 0, "css": 0}
stats = {"html_files": 0, "css_files": 0}
for root, dirs, files in os.walk(OUT):
    for f in files:
        fp = os.path.join(root, f)
        rel = os.path.relpath(fp, OUT).replace(os.sep, "/")
        if f.endswith(".html"):
            stats["html_files"] += 1
            if process_html_file(fp, rel):
                changed["html"] += 1
        elif f.endswith(".css"):
            stats["css_files"] += 1
            if process_css_file(fp, rel):
                changed["css"] += 1
print("rewritten:", changed, "totals:", stats, "local files:", len(local_files))
