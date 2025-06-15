from fastapi import APIRouter
from app.db.mock_data import mockUser

router = APIRouter()

@router.get("/")
def get_user_profile():
    return mockUser
