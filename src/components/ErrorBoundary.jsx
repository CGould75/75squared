import React from 'react';
import TelemetryEngine from '../lib/telemetry';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorId: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    // Dispatch to Supabase Telemetry Engine
    const errorId = `ERR-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    this.setState({ errorId });
    
    TelemetryEngine.dispatchException(
      'React UI Core (ErrorBoundary)',
      error.message || 'Unhandled UI Exceptions',
      { stack: error.stack, componentStack: errorInfo.componentStack },
      'fatal'
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '24px', border: '1px dashed rgba(239, 68, 68, 0.3)', padding: '40px', flexDirection: 'column' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '12px' }}>Critical View Crash</h2>
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6', marginBottom: '24px' }}>
            A fatal React exception caused this module to unmount. The telemetry payload has been securely routed to the SRE ledger.
          </p>
          <div style={{ background: 'white', padding: '12px 24px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#EF4444', fontFamily: 'monospace', border: '1px solid rgba(0,0,0,0.1)' }}>
            Reference: {this.state.errorId || 'Dispatching...'}
          </div>
          {this.state.errorMessage && (
            <div style={{ marginTop: '20px', background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '8px', fontSize: '0.85rem', color: '#B91C1C', wordBreak: 'break-all', maxWidth: '80%' }}>
              <strong>Error:</strong> {this.state.errorMessage}
            </div>
          )}
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ marginTop: '30px', padding: '12px 24px' }}>
             Force Cold Boot
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
