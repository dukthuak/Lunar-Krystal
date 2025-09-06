# Lunar Krystal - Start Bot Only
# PowerShell Script để chạy bot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    LUNAR KRYSTAL BOT" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Node.js
Write-Host "[1/3] Kiểm tra Node.js..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js không được cài đặt!" -ForegroundColor Red
    exit 1
}

# Kiểm tra dependencies
Write-Host "[2/3] Kiểm tra dependencies..." -ForegroundColor Green
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies đã được cài đặt" -ForegroundColor Green
} else {
    Write-Host "⚠ Cài đặt dependencies..." -ForegroundColor Yellow
    npm install
}

# Khởi động Bot
Write-Host "[3/3] Khởi động Bot..." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    KHỞI ĐỘNG BOT THÀNH CÔNG!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🤖 Bot: Đang chạy..." -ForegroundColor Green
Write-Host ""
Write-Host "Nhấn Ctrl+C để dừng bot..." -ForegroundColor Yellow
Write-Host ""

# Chạy bot
try {
    node main.js
} catch {
    Write-Host ""
    Write-Host "Đang dừng bot..." -ForegroundColor Yellow
}

Write-Host "✅ Đã dừng bot!" -ForegroundColor Green