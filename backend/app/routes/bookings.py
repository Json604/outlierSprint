from fastapi import APIRouter, HTTPException
from app.db.mock_data import mockUser
import uuid

router = APIRouter()

@router.get("/")
def get_user_bookings():
    return mockUser["bookings"]

@router.post("/")
def create_booking(booking: dict):
    new_booking = {
        "id": str(uuid.uuid4()),
        **booking
    }
    mockUser["bookings"].append(new_booking)
    return {"status": "success", "booking": new_booking}
