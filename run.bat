@echo off
title Lunar Krystal - Bot & Website
color 0A

echo.
echo ========================================
echo    LUNAR KRYSTAL - BOT & WEBSITE
echo ========================================
echo.

echo [INFO] Đang khởi động Bot và Website...
echo.

REM Chạy cả bot và web
start "Lunar Krystal Bot" cmd /k "cd /d %~dp0 && node main.js"
timeout /t 3 /nobreak >nul
start "Lunar Krystal Website" cmd /k "cd /d %~dp0\web && python -m http.server 8080"
timeout /t 2 /nobreak >nul

echo.
echo ========================================
echo    BOT VÀ WEBSITE ĐÃ KHỞI ĐỘNG!
echo ========================================
echo.
echo Bot: Đang chạy
echo Website: http://localhost:8080
echo.
echo Nhấn phím bất kỳ để đóng cửa sổ này...
pause >nul
