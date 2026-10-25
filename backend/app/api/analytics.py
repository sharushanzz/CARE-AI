from fastapi import APIRouter

router = APIRouter()

@router.get('/')
def analytics():
    return {
        'blood_pressure': [120, 122, 124, 126],
        'heart_rate': [72, 74, 73, 76],
        'sleep_hours': [7, 8, 6, 7],
        'water_intake': [2.5, 3.0, 3.2, 2.8]
    }
