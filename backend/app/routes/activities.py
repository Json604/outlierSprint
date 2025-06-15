from fastapi import APIRouter
from app.db.mock_data import mockActivities

router = APIRouter()

@router.get("/")
def get_activities():
    return mockActivities

@router.get("/{activity_id}")
def get_activity_by_id(activity_id: str):
    return next((a for a in mockActivities if a["id"] == activity_id), None)
