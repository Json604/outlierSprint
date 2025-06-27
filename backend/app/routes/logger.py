class Logger:
    def __init__(self):
        self.logs = {}  # session_id: [list of events]

    def log_action(self, session_id, action_type, payload):
        if session_id not in self.logs:
            self.logs[session_id] = []
        self.logs[session_id].append({
            "session_id": session_id,
            "actionType": action_type,
            "payload": payload
        })

    def get_logs(self, session_id=None):
        if session_id:
            return self.logs.get(session_id, [])
        
        # Flatten all events into a list with session_id included
        all_logs = []
        for sid, events in self.logs.items():
            for event in events:
                event_copy = event.copy()
                event_copy['session_id'] = sid
                all_logs.append(event_copy)
        return all_logs

    def get_all_logs_raw(self):
        """Returns full raw dict for debugging (session_id -> [events])"""
        return self.logs
