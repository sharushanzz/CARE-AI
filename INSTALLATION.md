# CARE-AI Installation Guide

This repository contains a React frontend and a FastAPI backend. This guide explains how to install and run the project from the root, plus how to work with each part separately.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ installed and on PATH
- Git (optional)
- Windows PowerShell (this guide is written for Windows)

## 1) Clone the repository

```powershell
cd "d:\college project\shobbi full"
git clone <repo-url> "shobii project"
cd "shobii project"
```

## 2) Install frontend dependencies

```powershell
cd frontend
npm install
```

## 3) Install backend dependencies

```powershell
cd ..\backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
```

If PowerShell prevents script execution, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 4) Run the backend server

From `backend/` with the virtual environment activated:

```powershell
py -m uvicorn main:app --reload --port 8000
```

If `uvicorn` is not found, confirm that you installed dependencies inside `backend/.venv`.

## 5) Run the frontend app

From `frontend/`:

```powershell
npm run dev
```

The frontend runs on `http://localhost:5173` by default and expects the backend on `http://localhost:8000`.

## 6) Run both frontend and backend together

From the repository root:

```powershell
npm install
npm run dev
```

This project uses the root `package.json` scripts to start both the frontend and backend together.

## 7) Backend-specific Windows notes

- Backend entrypoint: `backend/main.py`
- Backend server command: `py -m uvicorn main:app --reload --port 8000`
- Backend data folder: `backend/data`
- If port `8000` is already in use, change the `--port` value and update the frontend proxy if needed.

## 8) Troubleshooting

- "Module not found" after venv activation: reinstall with `py -m pip install -r requirements.txt`.
- "ExecutionPolicy prevents running scripts": run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.
- "Port 8000 already in use": stop the process using `8000`, or run the backend with a different port.
- "Directory does not exist" for uploads/documents: the backend creates required storage directories automatically, but verify `backend/data` exists.

## 9) Helpful commands

```powershell
# react frontend
cd frontend
npm run dev

# backend only
cd backend
.\.venv\Scripts\Activate.ps1
py -m uvicorn main:app --reload --port 8000
```

---

> For backend-only Windows install details, see `backend/INSTALLATION-WINDOWS.md`.
