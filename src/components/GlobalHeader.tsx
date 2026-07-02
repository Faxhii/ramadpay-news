import React, { useState, useEffect } from 'react';
import { FileText, Rss } from 'lucide-react';

export const GlobalHeader: React.FC = () => {
  const adverts = [
    "🚀 Send money to East Africa instantly with Ramad Pay!",
    "💸 Zero hidden fees on all transfers.",
    "💱 Get the best exchange rates today.",
    "🔒 Secure cash pickup & mobile money transfers."
  ];
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((prev) => (prev + 1) % adverts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      width: '100%',
      backgroundColor: '#12202b',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-xl)',
      height: '72px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }} className="global-header">
      
      {/* Left: Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1.75rem', 
          color: '#FFFFFF',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          Ramadpay
        </h1>
        <h1 style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1.75rem', 
          color: '#FFFFFF',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          margin: 0
        }}>
          News<span style={{ color: '#10B981' }}>.</span>
        </h1>
      </div>

      {/* Middle: Flash Advert */}
      <div className="flash-advert-container" style={{ 
        flexGrow: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        overflow: 'hidden' 
      }}>
        <div 
          key={adIndex}
          className="animate-fade-in"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            color: '#10B981',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          {adverts[adIndex]}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button className="header-action-btn">
          <FileText size={16} /> <span>Read Latest Briefing</span>
        </button>
        <button className="header-action-btn">
          <Rss size={16} /> <span>Feed</span>
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .global-header {
            flex-wrap: wrap;
            height: auto !important;
            padding: 12px var(--space-md) !important;
            gap: 12px;
          }
          .flash-advert-container {
            order: 3;
            width: 100%;
            margin-top: 4px;
          }
          .header-action-btn span {
            display: none !important;
          }
          .header-action-btn {
            padding: 8px !important;
          }
          .global-header h1 {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </header>
  );
};
