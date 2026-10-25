from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def get_emergency_card():
    return {"blood_group": "O+", "allergies": ["Penicillin"], "emergency_contact": "+1-555-0100"}
