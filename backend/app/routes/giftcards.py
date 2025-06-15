from fastapi import APIRouter
from app.db.mock_data import mockGiftCards

router = APIRouter()

@router.get("/")
def get_giftcards():
    return mockGiftCards

@router.get("/{giftcard_id}")
def get_giftcard_by_id(giftcard_id: str):
    return next((g for g in mockGiftCards if g["id"] == giftcard_id), None)
