@echo off
echo [AquaSense] A parar todos os servicos...
docker compose down
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao parar os servicos.
    pause
    exit /b 1
)
echo [AquaSense] Todos os servicos parados.
pause
