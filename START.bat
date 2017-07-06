@echo off
mode con: cols=120 lines=40
color 75
cls

start /b node app.js
if %errorlevel%==0 (goto openSite) else (goto exit)

:openSite
start http://localhost:8080

:exit
pause > NUL