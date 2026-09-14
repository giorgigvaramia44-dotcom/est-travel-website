@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo.
  echo Node.js is not installed.
  echo Install Node.js LTS from https://nodejs.org and run this file again.
  echo.
  pause
  exit /b 1
)

echo Starting EST Travel...
start "" http://localhost:3000
start "" http://localhost:3000/admin
node server.js
pause
