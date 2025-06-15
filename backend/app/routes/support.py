from fastapi import APIRouter

router = APIRouter()

@router.post("/contact")
def contact(message: dict):
    return {"status": "received", "message": message}

@router.get("/faqs")
def faqs():
    return [
        {"q": "How do I book a movie?", "a": "Go to the movie page and click book."},
        {"q": "Can I cancel a booking?", "a": "Yes, before showtime via profile."}
    ]
