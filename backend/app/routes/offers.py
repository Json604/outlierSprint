from fastapi import APIRouter
from app.db.mock_data import mockOffers

router = APIRouter()

@router.get("/")
def get_offers():
    return mockOffers

@router.get("/{offer_id}")
def get_offer(offer_id: str):
    return next((o for o in mockOffers if o["id"] == offer_id), None)
