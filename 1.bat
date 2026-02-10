@echo off
REM ------------------------------
REM 珍宝签到生态 GitHub 一键上传 & BoxJS 自动更新脚本
REM 适用于 Windows Git Bash / CMD / PowerShell
REM ------------------------------

REM 进入项目目录（改成你的项目路径）
cd /d "C:\Users\admin\Desktop\checkin-ecosystem"

echo ----------------------------------------
echo ✅ 检测 Git 仓库...
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo 📦 未检测到 Git 仓库，初始化中...
    git init
    git branch -M main
    REM 设置远程仓库（修改成你的仓库地址）
    git remote add origin https://github.com/wildZys/checkin-ecosystem.git
) else (
    echo 📦 已检测到 Git 仓库
)

echo ----------------------------------------
echo 📝 添加所有修改...
git add .

echo ----------------------------------------
REM 生成 commit 信息（可自动加版本号）
for /f "tokens=1-4 delims=/- " %%a in ('date /t') do set TODAY=%%c-%%a-%%b
set COMMIT_MSG=更新签到生态 %TODAY%
echo 💾 本次提交信息: %COMMIT_MSG%
git commit -m "%COMMIT_MSG%"

echo ----------------------------------------
REM 更新 BoxJS 订阅版本号（假设在 boxjs/version.json 中）
if exist boxjs\version.json (
    for /f "tokens=2 delims=:," %%i in ('findstr "version" boxjs\version.json') do set /a VERSION=%%i+1
    powershell -Command "(Get-Content boxjs\version.json) -replace '\"version\":\s*\d+', '\"version\": %VERSION%' | Set-Content boxjs\version.json"
    echo 🔢 BoxJS 订阅版本号已更新为 %VERSION%
)

echo ----------------------------------------
echo 🚀 推送到 GitHub...
git push -u origin main

echo ----------------------------------------
echo ✅ 上传 & BoxJS 自动更新完成！
pause
