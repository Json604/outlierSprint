class Logger:
    def __init__(self):
        self.logs = {}  # Stores logs in-memory, like { session_id: [list of events] }

    def log_action(self, session_id, action_type, payload):
        if session_id not in self.logs:
            self.logs[session_id] = []
        self.logs[session_id].append({
            "actionType": action_type,
            "payload": payload
        })

    def get_logs(self, session_id=None):
        if session_id:
            return self.logs.get(session_id, [])
        # Return all logs across all sessions
        all_logs = []
        for events in self.logs.values():
            all_logs.extend(events)
        return all_logs

logger = Logger()
