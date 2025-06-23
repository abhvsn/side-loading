# Sample React App with Comprehensive Audit Tracking System (TypeScript)

A full-stack application with React frontend and Node.js backend that demonstrates **comprehensive user interaction tracking** using global event listeners. The system automatically tracks route changes, button clicks, form submissions, input changes, and custom business events without requiring modifications to individual components.

## 🚀 Features

- **Node.js Backend**: Express server with enhanced audit logging API that handles multiple event types
- **React Frontend**: Two-page application with navigation and test components for audit tracking
- **Comprehensive Audit Tracking**: 
  - 🔄 **Route Changes** - Automatic navigation tracking
  - 👆 **Click Events** - Button and link interactions
  - 📝 **Form Submissions** - Complete form tracking with field analysis
  - ⌨️ **Input Changes** - Text input monitoring (debounced)
  - 🔧 **Custom Events** - Business logic and feature usage tracking
- **Global Event Listeners**: Zero-modification tracking using DOM event capture
- **Privacy-Safe**: Configurable data logging with sensitive information protection
- **TypeScript**: Full TypeScript implementation for both frontend and backend
- **Configurable Filtering**: Skip/include specific elements, classes, or IDs
- **Modern UI**: Beautiful interface with test components for demonstration

## 📁 Project Structure

```
side-loading/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Page1.tsx     # Enhanced with test components
│   │   │   └── Page2.tsx
│   │   ├── system/           # Audit tracking system
│   │   │   ├── AuditLogTracker.tsx  # Main tracking component
│   │   │   ├── AuditConfig.ts       # Configuration interface
│   │   │   └── AuditUtils.ts        # Utility functions
│   │   ├── App.tsx           # App with audit configuration
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
├── server/                    # Node.js backend
│   ├── src/
│   │   └── server.ts         # Enhanced audit logging API
│   ├── package.json
│   └── tsconfig.json
├── package.json              # Root package with dev scripts
└── README.md
```

## 🔍 Comprehensive Audit Tracking System

### How It Works

The audit tracking system uses **global event listeners** with DOM event capture to automatically track user interactions without requiring any modifications to existing components.

#### Key Components:

1. **AuditLogTracker Component**: 
   - Mounted once at the app level
   - Uses global event listeners to capture all DOM interactions
   - Automatically filters and processes events based on configuration

2. **Event Capture Strategy**:
   ```typescript
   // Captures events before they reach individual components
   document.addEventListener('click', handleClick, true); // Capture phase
   document.addEventListener('submit', handleSubmit, true);
   document.addEventListener('change', handleInputChange, true);
   ```

3. **Smart Filtering**:
   - Skip non-interactive elements (html, body, script, etc.)
   - Exclude elements with `data-no-audit` attribute
   - Configurable class/ID/tag filtering
   - Focus on buttons, links, forms, and inputs

### Tracked Events

| Event Type | Description | Data Captured |
|------------|-------------|---------------|
| `route_change` | Page navigation | Path, user ID, timestamp |
| `click` | Button/link clicks | Element info, coordinates, button type |
| `form_submit` | Form submissions | Form fields, action, method (values optional) |
| `input_change` | Text input changes | Input type, length, has value (content optional) |
| `custom` | Business events | Custom event type, business data |

### Configuration Options

```typescript
const auditConfig = {
  enableRouteTracking: true,
  enableClickTracking: true,
  enableFormTracking: true,
  enableInputTracking: true,
  debounceTime: 300, // Input debounce in ms
  trackingFilters: {
    skipClasses: ['no-audit'], // Skip elements with these classes
    trackOnlyClasses: null, // Only track these classes (null = all)
    skipTags: ['script', 'style'], // Skip these HTML tags
  },
  privacy: {
    logFormValues: false, // Don't log sensitive form data
    logInputValues: false, // Don't log input content
    maxTextLength: 50, // Truncate text content
  },
};
```

### Usage Examples

#### Automatic Tracking (Zero Code Changes)
```tsx
// Just mount the tracker in your App.tsx
<AuditLogTracker config={auditConfig} />

// All interactions are automatically tracked!
<button onClick={handleClick}>Click me</button> // ✅ Tracked
<form onSubmit={handleSubmit}>...</form>        // ✅ Tracked
<input onChange={handleChange} />               // ✅ Tracked
<button className="no-audit">Skip me</button>   // ❌ Skipped
```

#### Manual Business Event Tracking
```typescript
import { trackBusinessEvent, trackUserAction } from './system/AuditUtils';

// Track business workflows
trackBusinessEvent('checkout_completed', { orderId: '123', amount: 99.99 });

// Track feature usage
trackFeatureUsage('export_data', { format: 'csv', recordCount: 1500 });

// Track user actions
trackUserAction('search_performed', 'products_page', { query: 'laptops' });
```

## Setup and Installation

1. **Install dependencies for both client and server:**
   ```bash
   npm run install-deps
   ```

2. **Install concurrently for running both server and client simultaneously:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (Recommended)
Run both server and client simultaneously with TypeScript hot-reload:
```bash
npm run dev
```

This will start:
- TypeScript Node.js server with hot-reload on `http://localhost:5003`
- React TypeScript app on `http://localhost:3003`

### Testing the Audit System

1. Navigate to `http://localhost:3003`
2. Visit Page 1 to see the **Audit Tracking Test Section**
3. Try different interactions:
   - Type in the text area (debounced input tracking)
   - Submit the form (form tracking)
   - Click various buttons (click tracking)
   - Navigate between pages (route tracking)
   - Notice the red "Not Tracked" button is filtered out

### Server Console Output

You'll see rich audit logs like:
```bash
🚀 Route Change: { userId: 'anonymous', path: '/page1', timestamp: '...' }
👆 Click Event: { element: 'button', className: 'btn btn-primary', text: 'Submit Form...' }
📝 Form Submit: { formFields: ['test-textarea'], formMethod: 'get' }
⌨️ Input Change: { inputType: 'textarea', hasValue: true, valueLength: 15 }
🔧 Custom Event: { customEventType: 'business_event_page_loaded' }
```

## API Endpoints

- `GET /api/page/:pageName` - Returns greeting message for the specified page
- `POST /api/audit-log` - **Enhanced audit logging endpoint** that handles all event types
- `GET /api/health` - Health check endpoint

### Audit Log API Structure

```typescript
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
```

## Privacy & Security

- **No Sensitive Data**: Form values and input content are not logged by default
- **Configurable Privacy**: Control what data gets captured
- **Element Filtering**: Skip tracking for sensitive elements
- **Debounced Inputs**: Avoid excessive logging of keystroke events
- **Secure by Default**: Conservative privacy settings out of the box

## Production Considerations

- **Database Integration**: Replace console logging with database storage
- **User Authentication**: Integrate with your auth system for user identification
- **Data Retention**: Implement audit log retention policies
- **Performance**: Monitor impact of event listeners on large applications
- **Compliance**: Ensure audit logging meets your regulatory requirements

## Technologies Used

- **Backend**: Node.js, Express.js, CORS, TypeScript
- **Frontend**: React 18, React Router DOM, TypeScript
- **Audit System**: Global DOM event listeners, Custom event system
- **Styling**: Modern CSS with gradients and animations
- **Development**: Concurrently, ts-node-dev for hot-reload
- **Type Safety**: Full TypeScript implementation with comprehensive interfaces 