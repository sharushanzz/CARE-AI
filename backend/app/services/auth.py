from datetime import datetime, timedelta, timezone
from typing import Optional
import bcrypt
import jwt
import json
import uuid
import os
import re
from pathlib import Path
from pymongo import MongoClient, errors
from sqlalchemy import create_engine, MetaData, Table, Column, String, Text, JSON, select, insert, update
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings


BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / 'data'
USERS_FILE = DATA_DIR / 'users.json'
UPLOADS_DIR = DATA_DIR / 'uploads'
PROFILE_PHOTOS_DIR = UPLOADS_DIR / 'profile_photos'
DOCUMENTS_DIR = DATA_DIR / 'documents'
MAX_PHOTO_SIZE = 5 * 1024 * 1024
ALLOWED_PHOTO_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}
ALLOWED_DOCUMENT_TYPES = {
    'application/pdf': 'pdf',
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
}

MONGO_ENABLED = False
USER_COLLECTION = None
MYSQL_ENABLED = False
engine = None
metadata = None
USER_TABLE = None


def _connect_mongo():
    global MONGO_ENABLED, USER_COLLECTION
    try:
        client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        db = client[settings.DB_NAME]
        USER_COLLECTION = db.users
        MONGO_ENABLED = True
    except errors.PyMongoError:
        MONGO_ENABLED = False


def _ensure_dirs():
    PROFILE_PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _sanitize_text(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    sanitized = re.sub(r'[\x00-\x1f\x7f<>]', '', str(value)).strip()
    return sanitized


def _normalize_user_id(user: dict) -> dict:
    user_id = user.get('user_id') or user.get('id')
    if user_id:
        user['user_id'] = user_id
        user['id'] = user_id
    return user


def _sql_to_dict(row: Optional[any]) -> Optional[dict]:
    if not row:
        return None
    data = dict(row._mapping)
    if data.get('notification_preferences') is None:
        data['notification_preferences'] = {}
    if data.get('documents') is None:
        data['documents'] = []
    return _build_user_defaults(data)


def _connect_mysql():
    global MYSQL_ENABLED, engine, metadata, USER_TABLE
    if not settings.DATABASE_URL:
        return
    try:
        engine = create_engine(settings.DATABASE_URL, future=True, pool_pre_ping=True)
        metadata = MetaData()
        USER_TABLE = Table(
            'users',
            metadata,
            Column('user_id', String(36), primary_key=True),
            Column('name', String(255)),
            Column('email', String(255), unique=True),
            Column('role', String(50)),
            Column('password', Text),
            Column('phone', String(50)),
            Column('date_of_birth', String(50)),
            Column('gender', String(50)),
            Column('profile_photo', Text),
            Column('address', Text),
            Column('city', Text),
            Column('state', String(100)),
            Column('country', String(100)),
            Column('postal_code', String(50)),
            Column('blood_group', String(50)),
            Column('allergies', Text),
            Column('medical_conditions', Text),
            Column('current_medications', Text),
            Column('health_notes', Text),
            Column('emergency_contact_name', String(255)),
            Column('emergency_contact_relationship', String(255)),
            Column('emergency_contact_phone', String(50)),
            Column('alternative_contact', String(255)),
            Column('preferred_language', String(100)),
            Column('timezone', String(100)),
            Column('theme', String(50)),
            Column('notification_preferences', JSON),
            Column('documents', JSON),
            Column('created_at', String(50)),
            Column('updated_at', String(50)),
        )
        metadata.create_all(engine)
        MYSQL_ENABLED = True
    except SQLAlchemyError:
        MYSQL_ENABLED = False


def _build_user_defaults(user: dict) -> dict:
    defaults = {
        'role': 'user',
        'phone': '',
        'date_of_birth': '',
        'gender': 'Prefer not to say',
        'profile_photo': '',
        'address': '',
        'city': '',
        'state': '',
        'country': '',
        'postal_code': '',
        'blood_group': 'Unknown',
        'allergies': '',
        'medical_conditions': '',
        'current_medications': '',
        'health_notes': '',
        'emergency_contact_name': '',
        'emergency_contact_relationship': '',
        'emergency_contact_phone': '',
        'alternative_contact': '',
        'preferred_language': 'English',
        'timezone': 'UTC',
        'theme': 'System',
        'notification_preferences': {
            'medicine_reminders': True,
            'appointment_reminders': True,
            'health_alerts': True,
            'email_notifications': True,
        },
        'documents': [],
        'created_at': datetime.now(timezone.utc).isoformat(),
        'updated_at': datetime.now(timezone.utc).isoformat(),
    }
    merged = {**defaults, **user}
    if merged.get('notification_preferences') is None:
        merged['notification_preferences'] = defaults['notification_preferences']
    return _normalize_user_id(merged)


def _mongo_to_dict(doc: dict) -> dict:
    if not doc:
        return None
    data = {k: v for k, v in doc.items() if k != '_id'}
    return _build_user_defaults(data)

       

def _ensure_store():
    _ensure_dirs()

    if not USERS_FILE.exists() or USERS_FILE.read_text().strip() == '':
        USERS_FILE.write_text(json.dumps({'users': []}, indent=2))
        return

    try:
        data = json.loads(USERS_FILE.read_text())
        users = data.get('users', []) if isinstance(data, dict) else []
        if not isinstance(users, list):
            raise ValueError("Invalid users store")
    except (json.JSONDecodeError, TypeError, ValueError):
        USERS_FILE.write_text(json.dumps({'users': []}, indent=2))


        return

def _load_users() -> list[dict]:
    if not USERS_FILE.exists() or USERS_FILE.read_text().strip() == '':
        _ensure_store()
    try:
        data = json.loads(USERS_FILE.read_text())
        users = data.get('users', []) if isinstance(data, dict) else []
        if not isinstance(users, list):
            raise ValueError
        return users
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        _ensure_store()
        data = json.loads(USERS_FILE.read_text())
        return data.get('users', []) if isinstance(data, dict) else []


def _save_users(users: list[dict]):
    USERS_FILE.write_text(json.dumps({'users': users}, indent=2))


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_access_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {'sub': user_id, 'exp': expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def _find_user_by_email(email: str) -> Optional[dict]:
    email = str(email).lower()
    if MYSQL_ENABLED and USER_TABLE is not None and engine is not None:
        with engine.connect() as conn:
            stmt = select(USER_TABLE).where(USER_TABLE.c.email == email)
            row = conn.execute(stmt).first()
            return _sql_to_dict(row)
    if MONGO_ENABLED and USER_COLLECTION is not None:
        doc = USER_COLLECTION.find_one({'email': email})
        return _mongo_to_dict(doc)

    users = _load_users()
    for u in users:
        if u.get('email', '').lower() == email:
            return _build_user_defaults(u)
    return None


def get_user_by_id(user_id: str) -> Optional[dict]:
    if MYSQL_ENABLED and USER_TABLE is not None and engine is not None:
        with engine.connect() as conn:
            stmt = select(USER_TABLE).where(USER_TABLE.c.user_id == user_id)
            row = conn.execute(stmt).first()
            return _sql_to_dict(row)
    if MONGO_ENABLED and USER_COLLECTION is not None:
        doc = USER_COLLECTION.find_one({'user_id': user_id})
        return _mongo_to_dict(doc)

    users = _load_users()
    for u in users:
        if u.get('user_id') == user_id:
            return _build_user_defaults(u)
    return None


def _save_user(user: dict):
    if MYSQL_ENABLED and USER_TABLE is not None and engine is not None:
        if not isinstance(user.get('notification_preferences'), dict):
            user['notification_preferences'] = user.get('notification_preferences') or {}
        if not isinstance(user.get('documents'), list):
            user['documents'] = user.get('documents') or []
        values = {key: user[key] for key in USER_TABLE.c.keys() if key in user}
        with engine.begin() as conn:
            existing = conn.execute(select(USER_TABLE.c.user_id).where(USER_TABLE.c.user_id == user['user_id'])).first()
            if existing:
                conn.execute(update(USER_TABLE).where(USER_TABLE.c.user_id == user['user_id']).values(**values))
            else:
                conn.execute(insert(USER_TABLE).values(**values))
        return

    users = _load_users()
    found = False
    for i, existing in enumerate(users):
        if existing.get('user_id') == user['user_id']:
            users[i] = user
            found = True
            break
    if not found:
        users.append(user)
    _save_users(users)


def create_user(payload) -> dict:
    _ensure_dirs()
    email = str(payload.email).lower()
    if _find_user_by_email(email) is not None:
        raise ValueError('Email already registered')
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    user = _build_user_defaults({
        'user_id': user_id,
        'name': _sanitize_text(payload.name),
        'email': email,
        'role': 'user',
        'password': hash_password(payload.password),
        'created_at': now,
        'updated_at': now,
    })
    if MYSQL_ENABLED and USER_TABLE is not None and engine is not None:
        _save_user(user)
    elif MONGO_ENABLED and USER_COLLECTION is not None:
        USER_COLLECTION.insert_one(user)
    else:
        users = _load_users()
        users.append(user)
        _save_users(users)
    return {k: v for k, v in user.items() if k != 'password'}


def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = _find_user_by_email(email)
    if not user:
        return None
    if verify_password(password, user.get('password', '')):
        return {k: v for k, v in user.items() if k != 'password'}
    return None


def validate_password_strength(password: str):
    if len(password) < 8:
        raise ValueError('Password must be at least 8 characters long')
    if not re.search(r'[A-Z]', password):
        raise ValueError('Password must contain at least one uppercase letter')
    if not re.search(r'[a-z]', password):
        raise ValueError('Password must contain at least one lowercase letter')
    if not re.search(r'[0-9]', password):
        raise ValueError('Password must contain at least one number')
    if not re.search(r'[!@#$%^&*()_+\-=[\]{};:\"\\|,.<>/?]', password):
        raise ValueError('Password must contain at least one special character')


def update_user_profile(user_id: str, payload: dict) -> dict:
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError('User not found')
    if payload.get('email') and payload['email'].lower() != user['email'].lower():
        if _find_user_by_email(payload['email']):
            raise ValueError('Email already registered')
    updates = {}
    allowed = {
        'name', 'email', 'phone', 'date_of_birth', 'gender', 'address', 'city', 'state', 'country',
        'postal_code', 'blood_group', 'allergies', 'medical_conditions', 'current_medications',
        'health_notes', 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone',
        'alternative_contact', 'preferred_language', 'timezone', 'theme', 'notification_preferences',
        'profile_photo', 'documents',
    }
    for key, value in payload.items():
        if key not in allowed or value is None:
            continue
        if isinstance(value, str):
            updates[key] = _sanitize_text(value)
        else:
            updates[key] = value
    if 'notification_preferences' in updates and updates['notification_preferences'] is None:
        updates['notification_preferences'] = user.get('notification_preferences', {})
    updates['updated_at'] = datetime.now(timezone.utc).isoformat()
    updated = {**user, **updates}
    _save_user({**updated, 'password': user.get('password', '')})
    return {k: v for k, v in updated.items() if k != 'password'}


def change_user_password(user_id: str, current_password: str, new_password: str, confirm_password: str) -> None:
    if new_password != confirm_password:
        raise ValueError('Password confirmation does not match')
    validate_password_strength(new_password)
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError('User not found')
    if not verify_password(current_password, user.get('password', '')):
        raise ValueError('Current password is incorrect')
    user['password'] = hash_password(new_password)
    user['updated_at'] = datetime.now(timezone.utc).isoformat()
    _save_user(user)


def save_profile_photo(user_id: str, upload_file) -> str:
    if upload_file.content_type not in ALLOWED_PHOTO_TYPES:
        raise ValueError('Unsupported profile image type')
    _ensure_dirs()
    content = upload_file.file.read()
    if len(content) > MAX_PHOTO_SIZE:
        raise ValueError('Profile photo must be 5 MB or smaller')
    extension = ALLOWED_PHOTO_TYPES[upload_file.content_type]
    filename = f'{user_id}-{uuid.uuid4().hex}.{extension}'
    filepath = PROFILE_PHOTOS_DIR / filename
    filepath.write_bytes(content)
    user = get_user_by_id(user_id)
    if user and user.get('profile_photo'):
        old_path = BASE_DIR / user['profile_photo'].lstrip('/')
        if old_path.exists():
            old_path.unlink()
    photo_url = f'/uploads/profile_photos/{filename}'
    update_user_profile(user_id, {'profile_photo': photo_url})
    return photo_url


def delete_profile_photo(user_id: str) -> None:
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError('User not found')
    photo_url = user.get('profile_photo', '')
    if photo_url:
        path = BASE_DIR / photo_url.lstrip('/')
        if path.exists():
            path.unlink()
    update_user_profile(user_id, {'profile_photo': ''})


def add_user_document(user_id: str, upload_file) -> dict:
    if upload_file.content_type not in ALLOWED_DOCUMENT_TYPES:
        raise ValueError('Unsupported document type')
    _ensure_dirs()
    content = upload_file.file.read()
    if len(content) > 20 * 1024 * 1024:
        raise ValueError('Document must be 20 MB or smaller')
    extension = ALLOWED_DOCUMENT_TYPES[upload_file.content_type]
    filename = f'{user_id}-{uuid.uuid4().hex}.{extension}'
    filepath = DOCUMENTS_DIR / filename
    filepath.write_bytes(content)
    document = {
        'id': str(uuid.uuid4()),
        'name': _sanitize_text(upload_file.filename),
        'type': upload_file.content_type,
        'uploaded_at': datetime.now(timezone.utc).isoformat(),
        'status': 'AI Analyzed',
        'url': f'/documents/{filename}',
    }
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError('User not found')
    documents = user.get('documents', [])
    documents.insert(0, document)
    update_user_profile(user_id, {'documents': documents})
    return document


def delete_user_document(user_id: str, document_id: str) -> None:
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError('User not found')
    documents = user.get('documents', [])
    remaining = [doc for doc in documents if doc['id'] != document_id]
    if len(remaining) == len(documents):
        raise ValueError('Document not found')
    user['documents'] = remaining
    update_user_profile(user_id, {'documents': remaining})
    for doc in documents:
        if doc['id'] == document_id:
            path = BASE_DIR / doc['url'].lstrip('/')
            if path.exists():
                path.unlink()
            break


security = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail='Authentication required')
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = payload.get('sub')
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Token expired')
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid authentication token')
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail='User not found')
    return {k: v for k, v in user.items() if k != 'password'}


_connect_mysql()
_connect_mongo()
