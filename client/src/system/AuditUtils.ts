import React from 'react';
import { trackCustomEvent } from './AuditConfig';

/**
 * Utility functions for manual audit tracking
 */

/**
 * Track a custom business event
 * @param eventName - Name of the business event
 * @param data - Additional data to log
 */
export function trackBusinessEvent(eventName: string, data?: Record<string, any>): void {
  trackCustomEvent({
    eventType: `business_event_${eventName}`,
    customData: {
      businessEvent: eventName,
      ...data,
    },
  });
}

/**
 * Track user actions that don't trigger DOM events
 * @param action - The action performed
 * @param context - Context about where the action occurred
 * @param data - Additional data
 */
export function trackUserAction(action: string, context?: string, data?: Record<string, any>): void {
  trackCustomEvent({
    eventType: 'user_action',
    customData: {
      action,
      context,
      ...data,
    },
  });
}

/**
 * Track feature usage
 * @param featureName - Name of the feature used
 * @param data - Additional data about the feature usage
 */
export function trackFeatureUsage(featureName: string, data?: Record<string, any>): void {
  trackCustomEvent({
    eventType: 'feature_usage',
    customData: {
      featureName,
      ...data,
    },
  });
}

/**
 * Track errors or exceptions
 * @param errorType - Type of error
 * @param errorMessage - Error message
 * @param additionalData - Additional context
 */
export function trackError(errorType: string, errorMessage: string, additionalData?: Record<string, any>): void {
  trackCustomEvent({
    eventType: 'error',
    customData: {
      errorType,
      errorMessage,
      ...additionalData,
    },
  });
}

/**
 * Example usage in components (without modifying the components directly):
 * 
 * // In a useEffect or event handler:
 * import { trackBusinessEvent, trackUserAction, trackFeatureUsage } from './system/AuditUtils';
 * 
 * // Track when a user completes a workflow
 * trackBusinessEvent('workflow_completed', { workflowId: '123', duration: 45000 });
 * 
 * // Track when a user uses a specific feature
 * trackFeatureUsage('data_export', { format: 'csv', recordCount: 1500 });
 * 
 * // Track custom user actions
 * trackUserAction('search_performed', 'products_page', { query: 'laptops', resultsCount: 23 });
 * 
 * // Track errors
 * trackError('api_error', 'Failed to load user data', { statusCode: 500, endpoint: '/api/users' });
 */

/**
 * Higher-order component to automatically track component mounting/unmounting
 * @param Component - The component to wrap
 * @param componentName - Name to use in tracking
 * @returns Wrapped component with automatic tracking
 */
export function withAuditTracking<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  return function AuditTrackedComponent(props: T) {
    React.useEffect(() => {
      trackCustomEvent({
        eventType: 'component_mounted',
        customData: {
          componentName,
          props: Object.keys(props),
        },
      });

      return () => {
        trackCustomEvent({
          eventType: 'component_unmounted',
          customData: {
            componentName,
          },
        });
      };
    }, []);

    return React.createElement(Component, props);
  };
} 