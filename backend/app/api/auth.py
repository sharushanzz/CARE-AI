from fastapi import APIRouter, HTTPException
from app.models.user import UserCreate, UserLogin, UserOut
from app.services.auth import create_user, authenticate_user, create_access_token

router = APIRouter()

@router.post('/register')
def register(payload: UserCreate):
    try:
        user = create_user(payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    user_id = user.get('user_id') or user.get('id')
    token = create_access_token(user_id)
    return {'token': token, 'user': UserOut(**user)}

@router.post('/login')
def login(payload: UserLogin):
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail='Invalid credentials')
    user_id = user.get('user_id') or user.get('id')
    token = create_access_token(user_id)
    return {'token': token, 'user': UserOut(**user)}
