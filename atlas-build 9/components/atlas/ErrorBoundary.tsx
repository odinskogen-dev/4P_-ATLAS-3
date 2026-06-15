'use client';

import React, { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Globe/WebGL error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#050505',
              zIndex: 50,
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '400px' }}>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: '1.8',
                  marginBottom: '16px',
                }}
              >
                The 3D globe encountered an error and could not be displayed.
              </p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>
                {this.state.error?.message}
              </p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '8px 16px',
                  background: '#2E2EFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
