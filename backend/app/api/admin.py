from fastapi import APIRouter

router = APIRouter()

@router.get('/stats')
def admin_stats():
    return {'users': 128, 'reports': 342, 'doctors': 24, 'notifications': 7}
