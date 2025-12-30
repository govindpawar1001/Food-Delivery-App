@echo off
echo Starting Food Delivery App...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Starting servers...
echo Backend will run on http://localhost:3001
echo Frontend will run on http://localhost:3000
echo.

echo Default Admin Credentials:
echo Email: admin@admin.com
echo Password: admin123
echo.

start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm start"

echo Both servers are starting...
echo Check the opened command windows for server status.
pause