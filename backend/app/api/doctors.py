from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai import summarize_visit

router = APIRouter()

@router.get('/')
def list_doctors():
    return [{"id": "1", "name": "Dr. Sara Khan", "specialty": "Cardiology"}]


class SummaryRequest(BaseModel):
    notes: str


@router.post('/summary')
def doctor_summary(payload: SummaryRequest):
    return summarize_visit(payload.notes)
