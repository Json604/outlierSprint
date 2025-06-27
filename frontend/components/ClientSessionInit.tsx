'use client';

import { useEffect } from 'react';

export default function ClientSessionInit() {
  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      fetch('http://localhost:8000/_synthetic/new_session', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.session_id) {
            localStorage.setItem('session_id', data.session_id);
            console.log('✅ New synthetic session started:', data.session_id);
          }
        })
        .catch(err => console.error('Failed to start synthetic session:', err));
    }
  }, []);

  return null;
}
