from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.auth import router as auth_router
from app.api.reports import router as reports_router
from app.api.ai import router as ai_router
from app.api.admin import router as admin_router
from app.api.family import router as family_router
from app.api.reminders import router as reminders_router
from app.api.appointments import router as appointments_router
from app.api.chatbot import router as chatbot_router
from app.api.emergency import router as emergency_router
from app.api.doctors import router as doctors_router
from app.api.analytics import router as analytics_router
from app.api.profile import router as profile_router
from app.api.settings import router as settings_router
from app.core.config import settings

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / 'data'
UPLOADS_DIR = DATA_DIR / 'uploads'
DOCUMENTS_DIR = DATA_DIR / 'documents'
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title='CARE-AI API', version='1.0.0')
app.mount('/uploads', StaticFiles(directory=UPLOADS_DIR), name='uploads')
app.mount('/documents', StaticFiles(directory=DOCUMENTS_DIR), name='documents')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router, prefix='/api/auth', tags=['auth'])
app.include_router(family_router, prefix='/api/family', tags=['family'])
app.include_router(reports_router, prefix='/api/reports', tags=['reports'])
app.include_router(ai_router, prefix='/api/ai', tags=['ai'])
app.include_router(chatbot_router, prefix='/api/chatbot', tags=['chatbot'])
app.include_router(reminders_router, prefix='/api/reminders', tags=['reminders'])
app.include_router(appointments_router, prefix='/api/appointments', tags=['appointments'])
app.include_router(emergency_router, prefix='/api/emergency', tags=['emergency'])
app.include_router(doctors_router, prefix='/api/doctors', tags=['doctors'])
app.include_router(analytics_router, prefix='/api/analytics', tags=['analytics'])
app.include_router(profile_router, prefix='/api/profile', tags=['profile'])
app.include_router(settings_router, prefix='/api/settings', tags=['settings'])
app.include_router(admin_router, prefix='/api/admin', tags=['admin'])

@app.get('/api/health')
def health():
    return {'status': 'ok', 'service': 'CARE-AI API'}
