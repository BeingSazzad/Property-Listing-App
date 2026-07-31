@echo off
cd /d "%~dp0..\Landlord-Dashboard"
echo.
echo  Landlord HQ Admin Dashboard
echo  Open: http://localhost:5173
echo  Login: admin@landlordhq.co.uk / Admin123!
echo  Stop:  Ctrl+C
echo.
npm run dev
