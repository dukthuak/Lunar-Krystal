#!/bin/bash

echo "========================================"
echo "   LUNAR KRYSTAL BOT - START ALL"
echo "========================================"
echo

echo "[1/3] Starting Bot..."
gnome-terminal --title="Lunar Krystal Bot" -- bash -c "cd $(dirname "$0") && node main.js; exec bash" &
sleep 3

echo "[2/3] Starting Website Server..."
gnome-terminal --title="Website Server" -- bash -c "cd $(dirname "$0")/website && php -S localhost:8080; exec bash" &
sleep 2

echo "[3/3] Opening Website..."
xdg-open http://localhost:8080

echo
echo "========================================"
echo "   BOT AND WEBSITE STARTED SUCCESSFULLY!"
echo "========================================"
echo
echo "Bot: Running on background"
echo "Website: http://localhost:8080"
echo "Admin Panel: http://localhost:8080/admin"
echo
echo "Press Enter to close this window..."
read
