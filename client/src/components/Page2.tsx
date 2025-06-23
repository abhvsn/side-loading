import React, { useState, useEffect } from 'react';

interface ApiResponse {
  message: string;
  pageName: string;
}

function Page2(): JSX.Element {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPageMessage = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/page/page2');
        
        if (!response.ok) {
          throw new Error('Failed to fetch page message');
        }
        
        const data: ApiResponse = await response.json();
        setMessage(data.message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPageMessage();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="header">{message}</h1>
    </div>
  );
}

export default Page2; 