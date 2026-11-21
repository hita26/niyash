@echo off
title Ralph Loop - Autonomous Coding Runner
echo Starting Ralph Loop Engine...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ralph_loop.ps1"
pause
