import React, { useState, useEffect } from 'react';
import { FileText, Rss } from 'lucide-react';

export const GlobalHeader: React.FC = () => {
  const adverts = [
    { text: "🚀 Send money to East Africa instantly with Ramad Pay!", url: "https://ramadpay.com" },
    { text: "💸 Zero hidden fees on all transfers.", url: "https://ramadpay.com" },
    { text: "💱 Get the best exchange rates today.", url: "https://ramadpay.com" },
    { text: "🔒 Secure cash pickup & mobile money transfers.", url: "https://ramadpay.com" }
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
          Ramad Pay Daily News<span style={{ color: '#10B981' }}>.</span>
        </h1>
      </div>

      {/* Middle: Flash Advert */}
      <div className="flash-advert-container" style={{ 
        flexGrow: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        overflow: 'hidden' 
      }}>
        <a 
          key={adIndex}
          href={adverts[adIndex].url}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-fade-in"
          style={{
            display: 'block',
            textDecoration: 'none',
            background: 'linear-gradient(90deg, #FFD700, #F59E0B)',
            color: '#000000',
            padding: '8px 24px',
            borderRadius: '24px',
            fontSize: '1.05rem',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)',
            cursor: 'pointer'
          }}
        >
          {adverts[adIndex].text}
        </a>
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
