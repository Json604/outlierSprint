// Analytics Logger Service
export interface AnalyticsEvent {
  eventType: 'click' | 'scroll' | 'form_submit' | 'navigation' | 'booking' | 'search';
  elementId?: string;
  pagePath: string;
  timestamp: number;
  userId?: string;
  metadata?: Record<string, any>;
}

class AnalyticsLogger {
  private events: AnalyticsEvent[] = [];
  private isEnabled = true;

  log(event: Omit<AnalyticsEvent, 'timestamp'>) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    
    console.log('📊 Analytics Event:', analyticsEvent);

    try {
      const stored = localStorage.getItem('bookmyshow_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(analyticsEvent);
      localStorage.setItem('bookmyshow_analytics', JSON.stringify(events.slice(-100)));
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
    }

    // Send to backend with session_id
    const sessionId = localStorage.getItem('session_id') || 'no_session';
    
    try {
      fetch(`http://localhost:8000/_synthetic/log_event?session_id=${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: event.eventType,
          payload: {
            elementId: event.elementId,
            pagePath: event.pagePath,
            userId: event.userId,
            metadata: event.metadata,
          },
        }),
      }).catch((err) => console.warn('Failed to send event to backend', err));
    } catch (error) {
      console.warn('Failed to send event to backend', error);
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
    try {
      localStorage.removeItem('bookmyshow_analytics');
    } catch (error) {
      console.warn('Failed to clear analytics events:', error);
    }
  }
}

export const analyticsLogger = new AnalyticsLogger();

// Helper functions
export const logClick = (elementId: string, pagePath: string, metadata?: Record<string, any>) => {
  analyticsLogger.log({
    eventType: 'click',
    elementId,
    pagePath,
    metadata,
  });
};

export const logNavigation = (fromPath: string, toPath: string) => {
  analyticsLogger.log({
    eventType: 'navigation',
    pagePath: toPath,
    metadata: { fromPath, toPath },
  });
};

export const logBooking = (movieId: string, seats: string[], totalPrice: number, pagePath: string) => {
  analyticsLogger.log({
    eventType: 'booking',
    pagePath,
    metadata: { movieId, seats, totalPrice },
  });
};

export const logSearch = (query: string, resultCount: number, pagePath: string) => {
  analyticsLogger.log({
    eventType: 'search',
    pagePath,
    metadata: { query, resultCount },
  });
};
