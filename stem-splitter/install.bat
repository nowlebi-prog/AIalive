@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ============================================
echo   커버용 음원 분리기 - 설치 (처음 한 번만)
echo ============================================
echo.

REM --- Python 3.11 찾기 ---
set "PY="
py -3.11 --version >nul 2>&1 && set "PY=py -3.11"
if not defined PY (
    echo [1/4] Python 3.11 이 없어서 설치합니다...
    winget install -e --id Python.Python.3.11 --accept-source-agreements --accept-package-agreements
    if errorlevel 1 (
        echo.
        echo [오류] Python 자동 설치 실패.
        echo https://www.python.org/downloads/release/python-3119/ 에서
        echo "Windows installer 64-bit" 를 받아 설치한 뒤 이 파일을 다시 실행하세요.
        echo 설치할 때 "Add python.exe to PATH" 체크!
        pause
        exit /b 1
    )
    set "PY=py -3.11"
    py -3.11 --version >nul 2>&1 || (
        echo.
        echo Python 설치는 끝났어요. 이 창을 닫고 install.bat 를 한 번 더 실행해 주세요.
        pause
        exit /b 0
    )
) else (
    echo [1/4] Python 3.11 확인 완료
)

REM --- 가상환경 ---
if not exist venv\Scripts\python.exe (
    echo [2/4] 가상환경 만드는 중...
    %PY% -m venv venv || (echo [오류] 가상환경 생성 실패 & pause & exit /b 1)
) else (
    echo [2/4] 가상환경 이미 있음
)
set "VPY=venv\Scripts\python.exe"
%VPY% -m pip install --upgrade pip

REM --- PyTorch (NVIDIA GPU용 CUDA 버전) ---
echo [3/4] PyTorch GPU 버전 설치 중... (2~3GB, 시간 좀 걸려요)
%VPY% -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124 || (echo [오류] PyTorch 설치 실패 & pause & exit /b 1)

REM --- 나머지 ---
echo [4/4] 음원 분리 라이브러리 설치 중...
%VPY% -m pip install -r requirements.txt || (echo [오류] 라이브러리 설치 실패 & pause & exit /b 1)

echo.
%VPY% -c "import torch; print('GPU 인식:', torch.cuda.is_available(), torch.cuda.get_device_name(0) if torch.cuda.is_available() else '(없음 - CPU로 동작)')"
echo.
echo ============================================
echo   설치 완료! 이제 run.bat 를 더블클릭하세요.
echo ============================================
pause
