@echo off
rem Start a local static server for the vps-craft.com mirror.
rem Requires Python 3 (any). Open http://127.0.0.1:8090 afterwards.
cd /d "%~dp0mirror"
echo Serving VPS-Craft mirror at http://127.0.0.1:8090  (Ctrl+C to stop)
python -m http.server 8090 --bind 127.0.0.1
