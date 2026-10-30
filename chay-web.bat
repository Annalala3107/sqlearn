@echo off
title SQL Tham Tu - Dev Server (Localhost:3000)
color 0A
echo ========================================================
echo   DANG KHOI DONG HE THONG SQL THAM TU TREN LOCALHOST...
echo ========================================================
cd /d "%~dp0"
echo.
echo Trang web se chay tai: http://localhost:3000
echo Nhan Ctrl + C de dung may chu.
echo.
npm run dev
pause
