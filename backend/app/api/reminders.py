from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def list_reminders():
    return [{"id": "1", "name": "Vitamin D", "time": "08:00", "status": "pending"}]

@router.post('/')
def create_reminder(payload: dict):
    return {"status": "created", **payload}
