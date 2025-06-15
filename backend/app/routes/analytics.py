from fastapi import APIRouter

router = APIRouter()

@router.post("/search")
def log_search(query: dict):
    return {"status": "logged", "query": query}
