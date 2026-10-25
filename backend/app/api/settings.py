from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def settings():
    return {"dark_mode": True, "notifications": True, "language": "en"}
