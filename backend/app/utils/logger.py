from datetime import datetime
from app.utils.session_manager import session_logs

class Logger:
    def log_action(self, session_id, action_type, payload):
        event = {
            "session_id": session_id,
            "timestamp": datetime.utcnow().timestamp(),
            "action_type": action_type,
            "payload": payload
        }
        session_logs.setdefault(session_id, []).append(event)

    def get_logs(self, session_id):
        return session_logs.get(session_id, [])

# This is what synthetic.py is trying to import
logger = Logger()
