from __future__ import annotations

from datetime import datetime
from typing import Annotated, Optional
from pydantic import BaseModel, EmailStr, Field, StringConstraints

Password = Annotated[str, StringConstraints(min_length=8)]


class NotificationPreferences(BaseModel):
    medicine_reminders: bool = True
    appointment_reminders: bool = True
    health_alerts: bool = True
    email_notifications: bool = True


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: Password


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class DocumentItem(BaseModel):
    id: str
    name: str
    type: str
    uploaded_at: str
    status: str
    url: str


class ProfileUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    date_of_birth: Optional[str]
    gender: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    blood_group: Optional[str]
    allergies: Optional[str]
    medical_conditions: Optional[str]
    current_medications: Optional[str]
    health_notes: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_relationship: Optional[str]
    emergency_contact_phone: Optional[str]
    alternative_contact: Optional[str]
    preferred_language: Optional[str]
    timezone: Optional[str]
    theme: Optional[str]
    notification_preferences: Optional[NotificationPreferences]
    profile_photo: Optional[str]
    documents: Optional[list[DocumentItem]]


class PasswordChange(BaseModel):
    current_password: str
    new_password: Password
    confirm_password: str


class UserOut(BaseModel):
    id: str = Field(..., alias='user_id')
    name: str
    email: EmailStr
    role: str = 'user'
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    profile_photo: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    current_medications: Optional[str] = None
    health_notes: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    alternative_contact: Optional[str] = None
    preferred_language: Optional[str] = None
    timezone: Optional[str] = None
    theme: Optional[str] = None
    notification_preferences: NotificationPreferences = NotificationPreferences()
    created_at: str
    updated_at: str
    documents: list[DocumentItem] = []

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}
