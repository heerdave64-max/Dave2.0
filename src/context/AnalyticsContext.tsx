import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GA4TelemetryEvent } from '../types/store';

interface AnalyticsContextType {
  events: GA4TelemetryEvent[];
  logEvent: (
    eventName: GA4TelemetryEvent['eventName'],
    parameters?: Record<string, string | number | boolean | undefined>
  ) => void;
  clearEvents: () => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  sessionDuration: number;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<GA4TelemetryEvent[]>(() => {
    return [
      {
        id: 'init-pv-1',
        timestamp: new Date().toLocaleTimeString(),
        eventName: 'page_view',
        parameters: {
          page_title: 'Google Merch Store | Home',
          page_location: window.location.pathname,
          device_category: 'mobile',
          operating_system: 'Android',
          browser: 'Chrome',
        },
      },
    ];
  });
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(16); // Starts at the GA4 16s baseline

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const logEvent = (
    eventName: GA4TelemetryEvent['eventName'],
    parameters: Record<string, string | number | boolean | undefined> = {}
  ) => {
    const newEvent: GA4TelemetryEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      eventName,
      parameters: {
        ...parameters,
        session_sec: sessionDuration,
        device: 'mobile_chrome_android',
      },
    };
    setEvents((prev) => [newEvent, ...prev].slice(0, 50));
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        events,
        logEvent,
        clearEvents,
        isInspectorOpen,
        setIsInspectorOpen,
        sessionDuration,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
