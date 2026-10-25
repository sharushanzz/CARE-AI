from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.models.user import ProfileUpdate, PasswordChange, UserOut
from app.services.auth import (
    get_current_user,
    save_profile_photo,
    delete_profile_photo,
    update_user_profile,
    change_user_password,
    add_user_document,
    delete_user_document,
)

router = APIRouter()

@router.get('', response_model=UserOut)
@router.get('/', response_model=UserOut)
def profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.put('', response_model=UserOut)
@router.put('/', response_model=UserOut)
def update_profile(payload: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    try:
        return update_user_profile(current_user['user_id'], payload.model_dump(exclude_none=True))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.post('/photo')
def upload_profile_photo(photo: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        url = save_profile_photo(current_user['user_id'], photo)
        return {'profile_photo': url}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.delete('/photo')
def remove_profile_photo(current_user: dict = Depends(get_current_user)):
    try:
        delete_profile_photo(current_user['user_id'])
        return {'profile_photo': ''}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.put('/password')
def update_password(payload: PasswordChange, current_user: dict = Depends(get_current_user)):
    try:
        change_user_password(current_user['user_id'], payload.current_password, payload.new_password, payload.confirm_password)
        return {'message': 'Password updated successfully'}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.post('/documents')
def upload_document(document: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    try:
        return add_user_document(current_user['user_id'], document)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

@router.delete('/documents/{document_id}')
def remove_document(document_id: str, current_user: dict = Depends(get_current_user)):
    try:
        delete_user_document(current_user['user_id'], document_id)
        return {'status': 'deleted'}
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
