import os, re, subprocess, sys, time

GIT = r"C:\Program Files\Git\cmd\git.exe"
URL = os.environ["GIT_PUSH_URL"]  # https://git:<TOKEN>@github.com/Jdb5423C/vps-craft.git
def run(*args, check=True):
    p = subprocess.run([GIT, "-c", "credential.helper=", *args], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if check and p.returncode != 0:
        print("FAILED:", " ".join(a for a in args if "github_pat" not in a), "\n", p.stdout[-600:], "\n", p.stderr[-600:], flush=True)
        sys.exit(1)
    return p

def commit_and_push(msg, paths=None, pathspec_file=None):
    if paths:
        run("add", "--", *paths)
    if pathspec_file:
        run("add", "--pathspec-from-file=" + pathspec_file)
    st = run("status", "--porcelain")
    if not st.stdout.strip():
        print("skip (nothing new):", msg, flush=True)
        return
    run("commit", "-m", msg)
    t0 = time.time()
    p = run("push", URL, "main", check=False)
    if p.returncode != 0:
        print("PUSH FAILED:", msg, "\n", p.stdout[-800:], "\n", p.stderr[-800:], flush=True)
        sys.exit(2)
    print(f"OK  {msg}  -> pushed in {time.time()-t0:.0f}s", flush=True)

# ---- wave 0 already committed; just push it ----
p = run("push", URL, "main", check=False)
if p.returncode != 0:
    print("AUTH/PUSH test failed:\n", p.stdout[-500:], "\n", p.stderr[-500:], flush=True)
    sys.exit(3)
print("OK  wave0 (scripts+merge) pushed", flush=True)

BIG = {"deal", "use-case", "billing", "compare", "region", "line", "combo", "docs", "provider", "tier", "tools"}
rest = sorted(d for d in os.listdir("mirror") if os.path.isdir(os.path.join("mirror", d)) and d not in BIG)
res_paths = [f"mirror/{d}/" for d in rest] + [f"mirror/{f}" for f in os.listdir("mirror") if os.path.isfile(os.path.join("mirror", f))]
commit_and_push("site: root + misc pages", res_paths)

commit_and_push("site: billing + region", ["mirror/billing/", "mirror/region/"])
commit_and_push("site: compare + combo", ["mirror/compare/", "mirror/combo/"])
commit_and_push("site: line + tier", ["mirror/line/", "mirror/tier/"])
commit_and_push("site: docs + provider + tools", ["mirror/docs/", "mirror/provider/", "mirror/tools/"])
commit_and_push("site: use-case", ["mirror/use-case/"])

# deal in 4 chunks
slugs = sorted(d for d in os.listdir("mirror/deal") if os.path.isdir(os.path.join("mirror/deal", d)))
n = 4
chunks = [slugs[i::n] for i in range(n)]   # interleaved => balanced sizes
for i, ch in enumerate(chunks, 1):
    fn = f"deal_chunk{i}.txt"
    open(fn, "w", encoding="utf-8").write("\n".join(f"mirror/deal/{s}/" for s in ch) + "\n")
    commit_and_push(f"site: deal pages chunk {i}/{n} ({len(ch)})", pathspec_file=fn)
    os.remove(fn)

st = run("status", "--porcelain")
print("remaining uncommitted:", len(st.stdout.strip().splitlines()), flush=True)
if st.stdout.strip():
    run("rm", "--cached", "tmp_whoami.py", "tmp_createrepo.py", check=False)  # 含 token 的探针脚本不入库
    for f in ("tmp_whoami.py", "tmp_createrepo.py"):
        if os.path.exists(f):
            os.remove(f)
    run("add", "-A", "--", ".", ":(exclude)tmp_whoami.py", ":(exclude)tmp_createrepo.py")
    run("commit", "-m", "site: final sweep + drop token-bearing probe scripts")
    p = run("push", URL, "main", check=False)
    if p.returncode != 0:
        print("FINAL PUSH FAILED:", p.stderr[-500:], flush=True)
    else:
        print("OK  final sweep pushed", flush=True)
run("log", "--oneline", check=False).stdout and print(run("log", "--oneline").stdout[-400:], flush=True)
print("ALL DONE", flush=True)
