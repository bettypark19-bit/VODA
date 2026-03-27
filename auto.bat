@echo off
chcp 65001 >nul
setlocal

echo === Dev Push ===
echo.
echo [0] feat   - 새 기능
echo [1] fix    - 버그 수정
echo [2] docs   - 문서
echo.

set /p ti=타입 번호 선택:

if "%ti%"=="0" set type=feat
if "%ti%"=="1" set type=fix
if "%ti%"=="2" set type=docs

if not defined type (
    echo 잘못된 번호
    pause
    exit /b
)

set /p msg=커밋 메시지:
set commit=%type%: %msg%

echo.
echo 커밋: %commit%
echo 브랜치: dev
echo.
set /p ok=계속할까요? (y/n):

if /i not "%ok%"=="y" (
    echo 취소됨
    pause
    exit /b
)

git add .
git commit -m "%commit%"
git push origin dev

echo.
echo 완료!
pause