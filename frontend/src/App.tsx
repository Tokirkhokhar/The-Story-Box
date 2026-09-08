import { useState } from 'react';

interface HealthResponse {
  status: 'ok' | 'error';
  message: string;
  database: 'connected' | 'disconnected';
}

function App() {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    setHealthData(null);

    try {
      const baseUrl = import.meta.env?.VITE_API_URL ?? 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HealthResponse = await response.json();
      setHealthData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to backend server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="brand-badge">
        <span className="badge-dot"></span>
        The Story Box Catalog
      </div>

      <h1 className="title">Coming Soon</h1>

      <p className="subtitle">
        A curated platform for books, authors, and publisher management.
        Click below to check live connection with our backend catalog services.
      </p>

      <button
        type="button"
        className="connect-btn"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            Connecting...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
            Connect
          </>
        )}
      </button>

      {healthData && (
        <div className={`result-card ${healthData.status === 'ok' ? 'ok' : 'error'}`}>
          <div className="result-header">
            <div className="result-title">
              Backend Health Check
            </div>
            <span className={`status-pill ${healthData.status}`}>
              {healthData.status}
            </span>
          </div>

          <pre className="json-view">
{JSON.stringify(healthData, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="result-card error">
          <div className="result-header">
            <div className="result-title">
              Connection Failed
            </div>
            <span className="status-pill error">Offline</span>
          </div>

          <pre className="json-view">
{JSON.stringify({ status: 'error', message: error, database: 'unreachable' }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
