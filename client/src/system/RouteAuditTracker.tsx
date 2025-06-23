import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuditConfig, defaultAuditConfig, CustomAuditEvent } from './AuditConfig';

interface AuditLogEntry {
  userId: string;
  path: string;
  timestamp: string;
  eventType: 'route_change' | 'click' | 'form_submit' | 'input_change' | 'custom';
  elementInfo?: {
    tagName?: string;
    className?: string;
    id?: string;
    text?: string;
    href?: string;
    type?: string;
  };
  additionalData?: Record<string, any>;
}

// Replace this with your actual auth/user context or pass via props
function getCurrentUserId(): string {
  // In production, use context like AuthContext or a user store
  return localStorage.getItem('userId') || 'anonymous';
}

async function sendAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    await fetch('/api/audit-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}

function getElementInfo(element: Element, config: AuditConfig): AuditLogEntry['elementInfo'] {
  return {
    tagName: element.tagName.toLowerCase(),
    className: element.className || undefined,
    id: element.id || undefined,
    text: element.textContent?.trim().substring(0, config.privacy.maxTextLength) || undefined,
    href: element.getAttribute('href') || undefined,
    type: element.getAttribute('type') || undefined,
  };
}

function shouldTrackElement(element: Element, config: AuditConfig): boolean {
  const tagName = element.tagName.toLowerCase();
  const className = element.className;
  const id = element.id;
  
  // Skip elements in skip lists
  if (config.trackingFilters.skipTags.includes(tagName)) {
    return false;
  }
  
  if (config.trackingFilters.skipClasses.some(cls => className.includes(cls))) {
    return false;
  }
  
  if (config.trackingFilters.skipIds.includes(id)) {
    return false;
  }
  
  // Skip elements with data-no-audit attribute
  if (element.hasAttribute('data-no-audit')) {
    return false;
  }
  
  // Check if we should only track specific tags
  if (config.trackingFilters.trackOnlyTags && 
      !config.trackingFilters.trackOnlyTags.includes(tagName)) {
    return false;
  }
  
  // Check if we should only track specific classes
  if (config.trackingFilters.trackOnlyClasses && 
      !config.trackingFilters.trackOnlyClasses.some(cls => className.includes(cls))) {
    return false;
  }
  
  // Focus on interactive elements
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea', 'form'];
  const hasClickHandler = element.hasAttribute('onclick') || 
                         element.getAttribute('role') === 'button' ||
                         element.classList.contains('clickable') ||
                         element.classList.contains('btn') ||
                         element.classList.contains('button');
  
  return interactiveTags.includes(tagName) || hasClickHandler;
}

function createAuditEntry(
  eventType: AuditLogEntry['eventType'],
  elementInfo?: AuditLogEntry['elementInfo'],
  additionalData?: Record<string, any>
): AuditLogEntry {
  const currentPath = window.location.pathname + window.location.search + window.location.hash;
  
  return {
    userId: getCurrentUserId(),
    path: currentPath,
    timestamp: new Date().toISOString(),
    eventType,
    elementInfo,
    additionalData,
  };
}

interface RouteAuditTrackerProps {
  config?: Partial<AuditConfig>;
}

/**
 * React component that logs route changes and UI interactions for audit purposes.
 * Mount this once at the app's top-level (e.g., inside App.tsx or Layout.tsx)
 */
export function RouteAuditTracker({ config: userConfig }: RouteAuditTrackerProps = {}): null {
  const location = useLocation();
  const config = { ...defaultAuditConfig, ...userConfig };

  // Track route changes
  useEffect(() => {
    if (config.enableRouteTracking) {
      const auditLog = createAuditEntry('route_change');
      sendAuditLog(auditLog);
    }
  }, [location.pathname, location.search, location.hash, config.enableRouteTracking]);

  // Track UI interactions
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!config.enableClickTracking) return;
      
      const target = event.target as Element;
      if (target && shouldTrackElement(target, config)) {
        const elementInfo = getElementInfo(target, config);
        const auditLog = createAuditEntry('click', elementInfo, {
          clientX: event.clientX,
          clientY: event.clientY,
          button: event.button,
        });
        sendAuditLog(auditLog);
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      if (!config.enableFormTracking) return;
      
      const target = event.target as HTMLFormElement;
      if (target) {
        const elementInfo = getElementInfo(target, config);
        const formData = new FormData(target);
        const formFields = Array.from(formData.keys());
        
        const additionalData: Record<string, any> = {
          formFields,
          action: target.action,
          method: target.method,
        };
        
        // Optionally log form values (be careful with sensitive data)
        if (config.privacy.logFormValues) {
          additionalData.formValues = Object.fromEntries(formData);
        }
        
        const auditLog = createAuditEntry('form_submit', elementInfo, additionalData);
        sendAuditLog(auditLog);
      }
    };

    const handleInputChange = (event: Event) => {
      if (!config.enableInputTracking) return;
      
      const target = event.target as HTMLInputElement;
      if (target && ['input', 'select', 'textarea'].includes(target.tagName.toLowerCase())) {
        // Debounce input tracking to avoid too many events
        clearTimeout((target as any).__auditTimeout);
        (target as any).__auditTimeout = setTimeout(() => {
          const elementInfo = getElementInfo(target, config);
          const additionalData: Record<string, any> = {
            inputType: target.type,
            name: target.name,
            hasValue: !!target.value,
            valueLength: target.value?.length || 0,
          };
          
          // Optionally log input values (be very careful with sensitive data)
          if (config.privacy.logInputValues && !target.type.includes('password')) {
            additionalData.value = target.value;
          }
          
          const auditLog = createAuditEntry('input_change', elementInfo, additionalData);
          sendAuditLog(auditLog);
        }, config.debounceTime);
      }
    };

    const handleCustomEvent = (event: CustomEvent<CustomAuditEvent>) => {
      const customEvent = event.detail;
      let elementInfo: AuditLogEntry['elementInfo'] | undefined;
      
      if (customEvent.elementSelector) {
        const element = document.querySelector(customEvent.elementSelector);
        if (element) {
          elementInfo = getElementInfo(element, config);
        }
      }
      
      const auditLog = createAuditEntry('custom', elementInfo, {
        customEventType: customEvent.eventType,
        ...customEvent.customData,
      });
      sendAuditLog(auditLog);
    };

    // Add event listeners with capture phase to catch events early
    if (config.enableClickTracking) {
      document.addEventListener('click', handleClick, true);
    }
    if (config.enableFormTracking) {
      document.addEventListener('submit', handleSubmit, true);
    }
    if (config.enableInputTracking) {
      document.addEventListener('change', handleInputChange, true);
    }
    
    // Custom event listener
    window.addEventListener('audit-custom-event', handleCustomEvent as EventListener);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      document.removeEventListener('change', handleInputChange, true);
      window.removeEventListener('audit-custom-event', handleCustomEvent as EventListener);
    };
  }, [config]);

  return null; // No UI to render
} 