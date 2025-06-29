from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import (
    movies, events, plays, sports, activities,
    offers, giftcards, bookings, users,
    support, analytics, synthetic
)

app = FastAPI()

# Allow frontend to send requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Content Routes
app.include_router(movies.router, prefix="/movies")
app.include_router(events.router, prefix="/events")
app.include_router(plays.router, prefix="/plays")
app.include_router(sports.router, prefix="/sports")
app.include_router(activities.router, prefix="/activities")
app.include_router(offers.router, prefix="/offers")
app.include_router(giftcards.router, prefix="/giftcards")
app.include_router(bookings.router, prefix="/bookings")
app.include_router(users.router, prefix="/users")
app.include_router(support.router, prefix="/support")
app.include_router(analytics.router, prefix="/analytics")

# Synthetic Logging Routes
app.include_router(synthetic.router, prefix="/_synthetic")

# Root Route to confirm backend is alive
@app.get("/")
def root():
    return {"message": "Backend is running!"}
