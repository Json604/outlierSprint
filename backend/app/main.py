from fastapi import FastAPI
from app.routes import (
    movies, events, plays, sports, activities,
    offers, giftcards, bookings, users,
    support, analytics, synthetic
)

app = FastAPI()

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