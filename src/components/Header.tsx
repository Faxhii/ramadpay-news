import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  goHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ goHome }) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(252, 252, 250, 0.85)',
      backdropFilter: 'saturate(180%) blur(20px)',
      WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      zIndex: 100,
      height: '60px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Logo */}
        <div 
          onClick={goHome}
          style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.4rem', 
            fontWeight: 600, 
            color: 'var(--text-primary)',
            cursor: 'pointer',
            letterSpacing: '-0.02em'
          }}
        >
          Ramadpay News.
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <button 
            onClick={goHome}
            style={{ 
              background: 'rgba(47, 72, 88, 0.05)',
              border: '1px solid rgba(47, 72, 88, 0.1)',
              color: 'var(--color-accent)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 600,
              padding: '4px 12px',
              borderRadius: '20px',
              transition: 'background 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(47, 72, 88, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(47, 72, 88, 0.05)'}
          >
            Read Latest Briefing
          </button>

          <button 
            onClick={goHome}
            style={{ 
              background: 'rgba(0,0,0,0.03)',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
              padding: '6px 12px',
              borderRadius: '20px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.06)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
          >
            <ArrowLeft size={16} /> <span className="hide-mobile">Feed</span>
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
