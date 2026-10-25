from fastapi import APIRouter, HTTPException
from uuid import uuid4

router = APIRouter()

APPOINTMENTS = [
    {"id": "1", "doctor": "Dr. Sara", "hospital": "CarePoint", "date": "2026-08-20", "reason": "Follow up"},
]

@router.get('/')
def list_appointments():
    return APPOINTMENTS

@router.post('/')
def create_appointment(payload: dict):
    appointment = {"id": str(uuid4()), **payload}
    APPOINTMENTS.append(appointment)
    return appointment

@router.delete('/{appointment_id}')
def delete_appointment(appointment_id: str):
    global APPOINTMENTS
    appointment = next((appt for appt in APPOINTMENTS if appt['id'] == appointment_id), None)
    if not appointment:
        raise HTTPException(status_code=404, detail='Appointment not found')
    APPOINTMENTS = [appt for appt in APPOINTMENTS if appt['id'] != appointment_id]
    return {"status": "deleted", "id": appointment_id}
