@echo off
echo ========================================
echo  RailBlockAI - Development Startup
echo ========================================
echo.

echo Starting Backend and Frontend...
echo.

echo [Backend] Starting FastAPI server on http://127.0.0.1:8000
echo [Frontend] Starting Vite dev server on http://localhost:5173
echo.

echo Opening two terminal windows...
echo.

REM Start Backend in new window
start "RailBlockAI Backend" cmd /k "cd backend && python -m app.main"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend in new window
start "RailBlockAI Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend API: http://127.0.0.1:8000
echo API Docs:    http://127.0.0.1:8000/docs
echo Frontend:    http://localhost:5173
echo.
echo Wait 10 seconds then open your browser!
echo.

REM Wait and open browser
timeout /t 10 /nobreak
start http://localhost:5173

echo.
echo Development environment ready!
echo Close this window or press Ctrl+C to stop.
pause
