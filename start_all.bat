@echo off
echo ========================================
echo    LUNAR KRYSTAL BOT & WEBSITE
echo ========================================
echo.

echo [1/2] Starting Bot...
start "Lunar Krystal Bot" cmd /k "cd /d %~dp0 && node main.js"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Website...
start "Lunar Krystal Website" cmd /k "cd /d %~dp0\web && python -m http.server 8080"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    BOT AND WEBSITE STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Bot: Running on background
echo Website: http://localhost:8080
echo.
echo Press any key to close this window...
pause >nul
