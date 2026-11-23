@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist venv\Scripts\python.exe (
    echo 먼저 install.bat 를 실행해 주세요.
    pause
    exit /b 1
)
echo 음원 분리기를 켜는 중... 잠시 후 브라우저가 열려요.
echo (이 검은 창을 닫으면 프로그램이 꺼집니다)
venv\Scripts\python.exe app.py
pause
