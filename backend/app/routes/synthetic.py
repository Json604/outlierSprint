from fastapi import APIRouter, Request, Body, Query
from fastapi.responses import JSONResponse
import uuid
from enum import Enum
from typing import Any, Dict

from ..utils.logger import logger
from ..utils.session_manager import session_manager
from ..db.mock_data import mockUser  # Example reset point

class ActionType(str, Enum):
    CUSTOM = "custom"
    CLICK = "click"
    DB_UPDATE = "db_update"
    SCROLL = "scroll"
    FORM_SUBMIT = "form_submit"
    NAVIGATION = "navigation"
    BOOKING = "booking"
    SEARCH = "search"

router = APIRouter()

@router.post("/reset")
def reset_environment(seed: str = Query(None)):
    session_manager.clear_session()
    mockUser["bookings"] = []
    return {"status": "ok", "seed": seed}

@router.post("/new_session")
def new_session(seed: str = Query(None)):
    session_id = str(uuid.uuid4())
    session_manager.create_session(session_id)
    mockUser["bookings"] = []
    resp = JSONResponse({"session_id": session_id})
    resp.set_cookie(
        key="session_id",
        value=session_id,
        httponly=False,
        samesite="Lax",
        max_age=60 * 60 * 24
    )
    return resp

@router.post("/log_event")
def log_event(request: Request, content: Dict[str, Any] = Body(...)):
    session_id = request.query_params.get("session_id", "no_session")
    action_type_str = content.get("actionType")

    try:
        action_type = ActionType(action_type_str)
    except ValueError:
        return JSONResponse(
            status_code=400,
            content={"detail": f"Invalid action type: {action_type_str if action_type_str else 'None'}"}
        )

    action_payload = content.get("payload", {})
    logger.log_action(session_id, action_type, action_payload)
    return {"status": "logged"}

@router.get("/logs")
def get_logs(session_id: str = None):
    return logger.get_logs(session_id)
