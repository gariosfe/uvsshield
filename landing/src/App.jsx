import React from 'react';
import { Sun, ExternalLink } from 'lucide-react';

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#070913',
      color: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(6, 182, 212, 0.2)'
      }}>
        <Sun size={48} style={{ color: '#fff' }} />
      </div>
      <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
        UVShield
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '500px', marginBottom: '2.5rem' }}>
        Sistema Inteligente de Monitoreo de Radiación Ultravioleta
      </p>
      <a 
        href="/dashboard.html" 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.875rem 1.75rem',
          borderRadius: '12px',
          backgroundColor: '#8b5cf6',
          color: '#fff',
          fontWeight: '600',
          textDecoration: 'none',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
        }}
      >
        Ir al Dashboard <ExternalLink size={16} />
      </a>
    </div>
  );
}

export default App;
