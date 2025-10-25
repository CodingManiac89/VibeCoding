@echo off
cd /d "%~dp0"
SET PATH=%PATH%;C:\Program Files\nodejs
npm run dev
pause