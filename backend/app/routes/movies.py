from fastapi import APIRouter
from app.db.mock_data import mockMovies

router = APIRouter()

@router.get("/")
def get_movies():
    return mockMovies

@router.get("/{movie_id}")
def get_movie_by_id(movie_id: str):
    return next((movie for movie in mockMovies if movie["id"] == movie_id), None)
