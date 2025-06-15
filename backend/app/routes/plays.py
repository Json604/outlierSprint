from fastapi import APIRouter
from app.db.mock_data import mockPlays

router = APIRouter()

@router.get("/")
def get_plays():
    return mockPlays

@router.get("/{play_id}")
def get_play_by_id(play_id: str):
    return next((play for play in mockPlays if play["id"] == play_id), None)
