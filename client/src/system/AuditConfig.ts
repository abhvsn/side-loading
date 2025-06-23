export interface AuditConfig {
  enableRouteTracking: boolean;
  enableClickTracking: boolean;
  enableFormTracking: boolean;
  enableInputTracking: boolean;
  debounceTime: number;
  trackingFilters: {
    skipTags: string[];
    skipClasses: string[];
    skipIds: string[];
    trackOnlyTags: string[] | null; // null means track all, array means only these tags
    trackOnlyClasses: string[] | null;
  };
  privacy: {
    logFormValues: boolean;
    logInputValues: boolean;
    maxTextLength: number;
  };
}

export const defaultAuditConfig: AuditConfig = {
  enableRouteTracking: true,
  enableClickTracking: true,
  enableFormTracking: true,
  enableInputTracking: true,
  debounceTime: 500,
  trackingFilters: {
    skipTags: ['html', 'body', 'script', 'style', 'meta', 'head'],
    skipClasses: ['no-audit', 'audit-skip'],
    skipIds: [],
    trackOnlyTags: null,
    trackOnlyClasses: null,
  },
  privacy: {
    logFormValues: false,
    logInputValues: false,
    maxTextLength: 100,
  },
};

// Custom hook to track specific events programmatically
export interface CustomAuditEvent {
  eventType: string;
  elementSelector?: string;
  customData?: Record<string, any>;
}

export function trackCustomEvent(event: CustomAuditEvent): void {
  // This will be implemented in the AuditLogTracker
  window.dispatchEvent(new CustomEvent('audit-custom-event', { detail: event }));
} 