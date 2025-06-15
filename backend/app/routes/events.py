from fastapi import APIRouter
from app.db.mock_data import mockEvents

router = APIRouter()

@router.get("/")
def get_events():
    return mockEvents

@router.get("/{event_id}")
def get_event_by_id(event_id: str):
    return next((event for event in mockEvents if event["id"] == event_id), None)
