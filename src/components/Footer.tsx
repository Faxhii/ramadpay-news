import React from 'react';
import { Shield, Info, Mail } from 'lucide-react';

interface FooterProps {
  goHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ goHome }) => {
  return (
    <footer style={{
      backgroundColor: '#1E1E1E',
      color: '#E0E0E0',
      padding: 'var(--space-3xl) 0 var(--space-xl) 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      fontFamily: 'var(--font-sans)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-md)',
          paddingBottom: 'var(--space-2xl)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div 
            onClick={goHome}
            style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.75rem', 
              color: '#FFFFFF', 
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Ramadpay News
          </div>
          <p style={{ fontSize: '0.9rem', color: '#B0B0B0', lineHeight: 1.6, maxWidth: '400px' }}>
            An automated editorial hub for East African regional developments. Delivering curated, AI-processed updates daily.
          </p>
        </div>

        {/* Footer Bottom Block */}
        <div style={{
          paddingTop: 'var(--space-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
          fontSize: '0.75rem',
          color: '#8E8E8E'
        }} className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} Ramadpay News Media Group. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8E8E8E', textDecoration: 'none' }}>
              <Shield size={12} /> Privacy Policy
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8E8E8E', textDecoration: 'none' }}>
              <Info size={12} /> Editorial Standards
            </a>
            <a href="mailto:editor@lastaherald.com" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8E8E8E', textDecoration: 'none' }}>
              <Mail size={12} /> Contact Desk
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
