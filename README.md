# CARE-AI

CARE-AI is a healthcare platform for family medical report management, AI-assisted analysis, reminders, appointments, emergency support, and dashboard analytics.

## Repository layout
- `backend/` — Python FastAPI backend application and data storage
- `backend/app/` — FastAPI routers, services, models, and core config
- `backend/data/` — local report storage and runtime data files
- `frontend/` — React + Vite frontend application
- `package.json` — root scripts for running frontend and backend together

## Backend
The backend entrypoint is `backend/main.py`.

### Backend quick start
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
py -m uvicorn main:app --reload --port 8000
```

## Frontend
The frontend lives in `frontend/` and proxies `/api` to the backend on port `8000`.

### Frontend quick start
```powershell
cd frontend
npm install
npm run dev
```

## Run both together from root
```powershell
npm install
npm run dev
```

> `npm run dev` starts the frontend and backend together using `concurrently`.

## Notes
- The backend must be running on `http://localhost:8000` for frontend API calls.
- Frontend dev server runs on `http://localhost:5173` by default.
- Use `backend/INSTALLATION-WINDOWS.md` for a backend-specific Windows setup guide.
