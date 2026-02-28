'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en" data-theme="dark">
      <body style={{ margin: 0, background: '#0b171b', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '32rem' }}>
            <p style={{ color: '#b97532', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: '1rem' }}>
              Critical Error
            </p>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
              Something Went Wrong
            </h1>
            <p style={{ color: '#d7dee7', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
              A critical error occurred. Please try again or refresh the page.
            </p>
            <button
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #b97532',
                color: '#b97532',
                background: 'transparent',
                padding: '1rem 2.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = '#b97532'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#b97532'; }}
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
