# Backend Installation Guide — Windows

This backend guide steps through installing and running the CARE-AI backend on Windows (PowerShell). It assumes the repository root is `shobii project` and you have Git access.

## Prerequisites

- Git (optional): https://git-scm.com/
- Python 3.10 or later installed and on PATH: https://www.python.org/downloads/
- Recommended: VS Code with the Python extension

Open PowerShell (run as normal user). For commands that require administrative privileges, run PowerShell as Administrator.

---

## 1) Open the backend folder

```powershell
cd "d:\college project\shobbi full\shobii project\backend"
```

---

## 2) Create and activate a Python virtual environment

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If execution policy prevents running the activation script, run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 3) Install backend dependencies

```powershell
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
```

---

## 4) Prepare local data directories

The backend will create required `data/` directories automatically, but you can ensure they exist:

```powershell
mkdir -Force .\data
mkdir -Force .\data\reports
```

---

## 5) Run the backend server

```powershell
py -m uvicorn main:app --reload --port 8000
```

The backend API then listens on `http://localhost:8000`.

---

## 6) Notes

- If `uvicorn` is not found, confirm the dependencies installed successfully in the active `.venv`.
- If port `8000` is in use, change `--port` and update frontend proxy if needed.
- The backend app entrypoint is `backend/main.py`.

---

## 7) Troubleshooting

- "Module not found" after activating venv: make sure you installed packages with `py -m pip install -r requirements.txt`.
- "ExecutionPolicy prevents running scripts": use `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.
- "Path contains spaces": wrap paths in double quotes as shown above.
