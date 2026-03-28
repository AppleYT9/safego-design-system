@echo off
title SafeGo Backend
color 0A
echo ============================================================
echo   SafeGo Backend Server  ^|  http://localhost:8000
echo ============================================================
echo.

cd /d "%~dp0"

REM -- Check venv exists
if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found at venv\Scripts\python.exe
    echo         Please run:  python -m venv venv
    echo         Then:        venv\Scripts\pip install -r requirements.txt
    pause
    exit /b 1
)

REM -- Kill any stale process on port 8000 silently
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 " ^| findstr "LISTENING" 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM -- Show what API key is configured (masked)
echo [i] Environment loaded from .env
echo [i] Starting uvicorn on port 8000...
echo.

venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload --log-level info

echo.
echo [!] Backend stopped.
pause
