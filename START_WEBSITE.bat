@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed. Install Node.js LTS first.
  pause
  exit /b 1
)
set ADMIN_USERNAME=owner
set /p ADMIN_PASSWORD=Enter temporary local admin password: 
set STORAGE_DIR=%CD%\storage
start "" http://localhost:3000
start "" http://localhost:3000/admin
node server.js
pause
