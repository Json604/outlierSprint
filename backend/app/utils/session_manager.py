from uuid import uuid4

session_logs = {}

class SessionManager:
    def create_session(self, seed=None):
        session_id = str(uuid4())
        session_logs[session_id] = []
        return session_id

    def get_logs(self, session_id):
        return session_logs.get(session_id, [])

    def clear_session(self, seed=None):
        session_logs.clear()

# This is what synthetic.py is trying to import
session_manager = SessionManager()
