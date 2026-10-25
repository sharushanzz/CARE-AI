from fastapi import APIRouter

router = APIRouter()

@router.post('/')
def chat(payload: dict):
    return {"reply": f"I can help with {payload.get('message', 'your care questions')}."}
