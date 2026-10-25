# CARE-AI Project - Unified Setup Guide

## 🎯 Overview

This project has been reorganized for simplified management:
- **Single Virtual Environment**: All Python packages in one `venv` folder
- **Single Entry Point**: Run entire project with `python app.py`
- **Auto Browser Launch**: Frontend opens automatically when you start the app

## 📋 Prerequisites

- **Python 3.8+** (for backend)
- **Node.js & npm** (for frontend)

### Install Prerequisites

#### Windows
```bash
# Python: Download from https://www.python.org/downloads/
# Node.js: Download from https://nodejs.org/ (LTS recommended)

# Verify installations
python --version
node --version
npm --version
```

#### Linux/Mac
```bash
# Using package manager (example: Ubuntu)
sudo apt update
sudo apt install python3 python3-venv nodejs npm

# Verify
python3 --version
node --version
npm --version
```

## 🚀 Quick Start

### Step 1: Initial Setup (First Time Only)

Navigate to the project root and run the setup script:

```bash
# Windows
python setup.py

# Linux/Mac
python3 setup.py
```

This script will:
- ✅ Remove old venv folders (.venv)
- ✅ Create single `venv` folder in project root
- ✅ Install all Python dependencies (FastAPI, Uvicorn, etc.)
- ✅ Install all Node.js dependencies (React, Vite, etc.)

### Step 2: Start the Application

Simply run:

```bash
python app.py
```

This will:
- 🚀 Start FastAPI backend on `http://localhost:8000`
- 🚀 Start Vite dev server on `http://localhost:5173`
- 🌐 Automatically open your browser to the application
- 📊 Display API documentation at `http://localhost:8000/docs`

## 📁 Project Structure

```
shobii project/
├── app.py                 # 🎯 Main entry point - Start here!
├── setup.py              # 🔧 Setup script - Run once initially
├── venv/                 # 📦 Single virtual environment (created by setup)
├── backend/
│   ├── main.py           # FastAPI app
│   ├── requirements.txt   # Python dependencies
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── models/       # Data models
│   │   ├── services/     # Business logic
│   │   └── core/         # Configuration
│   └── data/             # Data storage
└── frontend/
    ├── package.json      # Node.js dependencies
    ├── src/              # React components
    └── public/           # Static assets
```

## 🔧 What Changed

### Before
- Multiple venv folders (`.venv` in project root, backend, frontend)
- Multiple startup commands needed
- Manual browser opening

### After ✨
- **One venv** folder in project root
- **One command** to run everything: `python app.py`
- **Auto browser opening** when starting
- Cleaner, easier to manage

## 📖 Development Workflow

### Run Full Application (Recommended)
```bash
python app.py
```

### Run Only Backend (for testing API)
```bash
# Activate venv first
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Then run backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run Only Frontend
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Output will be in frontend/dist/
```

## 🛠️ Troubleshooting

### Issue: "python" or "npm" not found
**Solution**: Make sure Python and Node.js are installed and in your PATH
```bash
python --version
npm --version
```

### Issue: Backend fails to start
**Solution**: Try installing dependencies manually:
```bash
# Activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt
```

### Issue: Frontend dependencies not installing
**Solution**: Clear npm cache and reinstall:
```bash
cd frontend
npm cache clean --force
npm install
```

### Issue: Port already in use
**Solution**: Change port in app.py or kill existing process:
```bash
# Windows - kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac - kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

## 📊 API Documentation

Once backend is running, view interactive API docs:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 Environment Variables

If backend requires .env file, create `backend/.env`:
```env
# Example
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
```

## 📝 Notes

- Backend auto-reloads on Python file changes (development mode)
- Frontend auto-refreshes on React file changes (Vite feature)
- Both servers run simultaneously with auto browser opening
- Ctrl+C stops all servers gracefully

## ❓ Need Help?

Check the original project documentation in [INSTALLATION.md](INSTALLATION.md)

---

**Happy coding! 🎉**
