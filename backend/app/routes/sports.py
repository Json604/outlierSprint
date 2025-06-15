from fastapi import APIRouter
from app.db.mock_data import mockSports

router = APIRouter()

@router.get("/")
def get_sports():
    return mockSports

@router.get("/{sport_id}")
def get_sport_by_id(sport_id: str):
    return next((sport for sport in mockSports if sport["id"] == sport_id), None)
