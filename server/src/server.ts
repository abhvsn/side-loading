import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5003', 10);

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

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to get page greeting
app.get('/api/page/:pageName', (req: Request, res: Response) => {
  const { pageName } = req.params;
  const message = `Hello ${pageName}`;
  
  res.json({
    message: message,
    pageName: pageName
  });
});

// API endpoint for audit logging
app.post('/api/audit-log', (req: Request<{}, {}, AuditLogEntry>, res: Response) => {
  const { userId, path, timestamp, eventType, elementInfo, additionalData } = req.body;
  
  // Create a comprehensive log entry
  const logEntry = {
    userId,
    path,
    timestamp,
    eventType,
    elementInfo,
    additionalData,
    serverTimestamp: new Date().toISOString()
  };
  
  // Log different event types with appropriate formatting
  switch (eventType) {
    case 'route_change':
      console.log(`🚀 Route Change:`, {
        userId,
        path,
        timestamp: logEntry.serverTimestamp
      });
      break;
      
    case 'click':
      console.log(`👆 Click Event:`, {
        userId,
        path,
        element: elementInfo?.tagName,
        className: elementInfo?.className,
        text: elementInfo?.text,
        coordinates: additionalData?.clientX && additionalData?.clientY ? 
          `(${additionalData.clientX}, ${additionalData.clientY})` : undefined,
        timestamp: logEntry.serverTimestamp
      });
      break;
      
    case 'form_submit':
      console.log(`📝 Form Submit:`, {
        userId,
        path,
        formAction: additionalData?.action,
        formMethod: additionalData?.method,
        formFields: additionalData?.formFields,
        timestamp: logEntry.serverTimestamp
      });
      break;
      
    case 'input_change':
      console.log(`⌨️  Input Change:`, {
        userId,
        path,
        inputType: additionalData?.inputType,
        inputName: additionalData?.name,
        hasValue: additionalData?.hasValue,
        valueLength: additionalData?.valueLength,
        timestamp: logEntry.serverTimestamp
      });
      break;
      
    case 'custom':
      console.log(`🔧 Custom Event:`, {
        userId,
        path,
        customEventType: additionalData?.customEventType,
        customData: additionalData,
        timestamp: logEntry.serverTimestamp
      });
      break;
      
    default:
      console.log(`🔍 Audit Log:`, logEntry);
  }
  
  // In production, you would save this to a database
  // Example: await auditLogService.save(logEntry);
  
  res.json({
    success: true,
    message: 'Audit log recorded',
    eventType
  });
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Audit logging is enabled - all user interactions will be logged`);
}); 