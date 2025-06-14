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
    
    // In a real app, this would send to your analytics service
    console.log('📊 Analytics Event:', analyticsEvent);
    
    // Store in localStorage for demo purposes
    try {
      const stored = localStorage.getItem('bookmyshow_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(analyticsEvent);
      localStorage.setItem('bookmyshow_analytics', JSON.stringify(events.slice(-100))); // Keep last 100 events
    } catch (error) {
      console.warn('Failed to store analytics event:', error);
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

// Helper functions for common events
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