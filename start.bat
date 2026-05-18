@echo off
echo [AquaSense] A iniciar todos os servicos...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar os servicos. Verifica o Docker Desktop.
    pause
    exit /b 1
)
echo.
echo [AquaSense] Servicos iniciados. A aguardar o backend ficar pronto...
timeout /t 30 /nobreak >nul
echo.
echo [AquaSense] URLs disponiveis:
echo   Frontend:  http://localhost
echo   Backend:   http://localhost:8080
echo   Health:    http://localhost:8080/health
echo.
pause
