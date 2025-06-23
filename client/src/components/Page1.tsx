import React, { useState, useEffect } from 'react';
import { trackBusinessEvent, trackUserAction, trackFeatureUsage } from '../system/AuditUtils';

interface ApiResponse {
  message: string;
  pageName: string;
}

function Page1(): JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Test form state
  const [testInput, setTestInput] = useState<string>('');
  const [submitCount, setSubmitCount] = useState<number>(0);

  useEffect(() => {
    const fetchPageMessage = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/page/page1');
        
        if (!response.ok) {
          throw new Error('Failed to fetch page message');
        }
        
        const data: ApiResponse = await response.json();
        setMessage(data.message);
        
        // Track page load as a business event
        trackBusinessEvent('page_loaded', { 
          pageName: 'page1',
          loadTime: Date.now() - performance.timing.navigationStart 
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPageMessage();
  }, []);

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitCount(prev => prev + 1);
    console.log('Form submitted with text:', testInput);
    
    // Manual tracking for business logic
    trackBusinessEvent('test_form_submitted', { 
      textLength: testInput.length,
      submissionCount: submitCount + 1 
    });
    
    // This will also be tracked automatically by the audit system
  };

  const handleTestButtonClick = () => {
    console.log('Test button clicked!');
    
    // Track as user action
    trackUserAction('test_button_click', 'page1_test_section');
    
    // This will also be tracked automatically by the audit system
  };

  const handleClearClick = () => {
    setTestInput('');
    console.log('Clear button clicked!');
    
    // Track as feature usage
    trackFeatureUsage('text_clear', { previousLength: testInput.length });
    
    // This will also be tracked automatically by the audit system
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="header">{message}</h1>
      
      {/* Test section for audit tracking */}
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>🧪 Audit Tracking Test Section</h3>
        <p>Use the controls below to test the audit tracking system. All interactions will be logged!</p>
        
        <form onSubmit={handleTestSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="test-textarea" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Test Text Area:
            </label>
            <textarea
              id="test-textarea"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Type something here to test input tracking..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Submit Form (Test Form Tracking)
            </button>
            
            <button 
              type="button"
              onClick={handleTestButtonClick}
              className="btn btn-secondary"
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Test Button Click
            </button>
            
            <button 
              type="button"
              onClick={handleClearClick}
              className="btn btn-warning"
              style={{
                padding: '10px 20px',
                backgroundColor: '#ffc107',
                color: '#212529',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear Text
            </button>
            
            {/* Button with no-audit class to test filtering */}
            <button 
              type="button"
              className="btn no-audit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              title="This button should NOT be tracked (has 'no-audit' class)"
            >
              🚫 Not Tracked
            </button>
          </div>
        </form>
        
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Stats:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Text length: {testInput.length} characters</li>
            <li>Form submissions: {submitCount}</li>
            <li>Current text: {testInput || '(empty)'}</li>
          </ul>
          
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
            <strong>Audit Tracking Info:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              <li>✅ Form submissions are tracked (automatic + manual)</li>
              <li>✅ Button clicks are tracked (automatic + manual)</li>
              <li>✅ Text area changes are tracked (automatic, debounced)</li>
              <li>✅ Route changes are tracked (automatic)</li>
              <li>✅ Page loads are tracked (manual business event)</li>
              <li>🚫 Red button is NOT tracked (has 'no-audit' class)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page1; 