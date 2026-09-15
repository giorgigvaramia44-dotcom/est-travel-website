@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed. Install Node.js LTS first.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing npm packages...
  call npm install
  if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

where docker >nul 2>nul
if %errorlevel% equ 0 (
  echo Starting Postgres with Docker...
  docker compose up -d
) else (
  echo Docker was not found. Start Postgres yourself before using the site.
)

set ADMIN_USERNAME=owner
set /p ADMIN_PASSWORD=Enter temporary local admin password: 
set STORAGE_DIR=%CD%\storage
if not defined DATABASE_URL set DATABASE_URL=postgres://esttravel:esttravel@localhost:5432/esttravel
start "" http://localhost:3000
start "" http://localhost:3000/admin
node server.js
pause
