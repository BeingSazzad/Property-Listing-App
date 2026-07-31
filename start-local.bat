@echo off
cd /d "%~dp0"
echo.
echo  Landlord HQ - Local
echo  -------------------
echo  URL:   http://localhost:5500/landlord_hq_mobile_screens.html
echo  Login: john@landlordhq.co.uk / Password1
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5500" ^| findstr "LISTENING"') do (
  echo  Server already running on port 5500.
  echo  Open the URL above in your browser — no new window needed.
  echo.
  pause
  exit /b 0
)

echo  Starting server in this window...
echo  Stop with Ctrl+C
echo.
npm run start
