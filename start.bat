@echo off
REM Quick start script for Windows
REM This script runs the entire CARE-AI project with one click

echo.
echo ============================================================
echo         CARE-AI Project - Quick Start
echo ============================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if venv exists
if not exist "venv" (
    echo.
    echo ERROR: Virtual environment not found!
    echo Please run setup first:
    echo.
    echo   python setup.py
    echo.
    pause
    exit /b 1
)

echo Starting CARE-AI Application...
echo.

REM Run the app
python app.py

pause
