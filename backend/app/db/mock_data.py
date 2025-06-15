from datetime import datetime, timedelta

# Helper functions
def get_future_date(days):
    return (datetime.now() + timedelta(days=days)).strftime('%Y-%m-%d')

def get_past_date(days):
    return (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')


# Movie Example (shortened for brevity)
mockMovies = [
    {
        "id": "1",
        "title": "Pathaan",
        "genre": ["Action", "Thriller"],
        "language": ["Hindi", "English"],
        "duration": 146,
        "rating": 4.2,
        "votes": 245000,
        "poster": "https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=400",
        "banner": "https://images.pexels.com/photos/7991158/pexels-photo-7991158.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "trailer": "https://example.com/pathaan-trailer",
        "description": "An action-packed thriller.",
        "cast": ["Shah Rukh Khan", "Deepika Padukone"],
        "director": "Siddharth Anand",
        "releaseDate": get_past_date(30),
        "city": ["Mumbai"],
        "theaters": [
            {
                "id": "t1",
                "name": "PVR Cinemas",
                "address": "Phoenix Mall, Mumbai",
                "city": "Mumbai",
                "showtimes": ["10:00 AM", "1:30 PM"],
                "seats": {"regular": 150, "premium": 50, "executive": 25}
            }
        ],
        "price": {"regular": 200, "premium": 350, "executive": 500}
    }
]

mockEvents = []
mockPlays = []
mockSports = []
mockActivities = []
mockOffers = []
mockGiftCards = []

mockUser = {
    "id": "user1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "city": "Mumbai",
    "bookings": []
}