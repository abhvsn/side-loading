import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import { AuditLogTracker } from './system/AuditLogTracker';
import { AuditConfig } from './system/AuditConfig';

function Navigation(): JSX.Element {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link 
        to="/page1" 
        className={`nav-link ${location.pathname === '/page1' ? 'active' : ''}`}
      >
        Page 1
      </Link>
      <Link 
        to="/page2" 
        className={`nav-link ${location.pathname === '/page2' ? 'active' : ''}`}
      >
        Page 2
      </Link>
    </nav>
  );
}

function App(): JSX.Element {
  // Custom audit configuration - you can customize this based on your needs
  const auditConfig: Partial<AuditConfig> = {
    enableRouteTracking: true,
    enableClickTracking: true,
    enableFormTracking: true,
    enableInputTracking: true, // Enable input tracking for testing
    debounceTime: 300,
    trackingFilters: {
      // Track buttons and navigation links
      trackOnlyClasses: null, // Track all elements (remove restriction for testing)
      skipClasses: ['no-audit'], // Skip elements with this class
      skipTags: ['html', 'body', 'script', 'style', 'meta', 'head'],
      skipIds: [],
      trackOnlyTags: null,
    },
    privacy: {
      logFormValues: false, // Keep form values private
      logInputValues: false, // Keep input values private  
      maxTextLength: 50,
    },
  };

  return (
    <Router>
      {/* Enhanced AuditLogTracker with custom configuration */}
      <AuditLogTracker config={auditConfig} />
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 