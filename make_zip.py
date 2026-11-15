import zipfile, os, time
t0 = time.time()
src = 'mirror'
out = 'vps-craft-mirror-site.zip'
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for r, d, fs in os.walk(src):
        for f in fs:
            fp = os.path.join(r, f)
            z.write(fp, os.path.relpath(fp, '.'))
print('zip MB', round(os.path.getsize(out) / 1048576, 1), 'secs', round(time.time() - t0))
