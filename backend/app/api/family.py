from fastapi import APIRouter
from uuid import uuid4

router = APIRouter()

FAMILY_MEMBERS = [
    {"id": "1", "name": "Ava", "relation": "Daughter", "blood_group": "O+"},
    {"id": "2", "name": "Noah", "relation": "Husband", "blood_group": "A+"},
    {"id": "3", "name": "Mia", "relation": "Mother", "blood_group": "B-"},
]

@router.get('/')
def list_family():
    return FAMILY_MEMBERS

@router.post('/')
def create_family(payload: dict):
    member = {
        "id": str(uuid4()),
        "name": payload.get('name'),
        "relation": payload.get('relation'),
        "blood_group": payload.get('blood_group'),
    }
    FAMILY_MEMBERS.append(member)
    return member

@router.delete('/{member_id}')
def delete_family_member(member_id: str):
    global FAMILY_MEMBERS
    member = next((m for m in FAMILY_MEMBERS if m['id'] == member_id), None)
    if not member:
        return {"status": "error", "message": "Member not found"}
    FAMILY_MEMBERS = [m for m in FAMILY_MEMBERS if m['id'] != member_id]
    return {"status": "deleted", "id": member_id}
