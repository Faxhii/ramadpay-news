import React from 'react';

export const AdBanner: React.FC = () => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A2935 0%, #2F4858 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-2xl) var(--space-xl)',
      position: 'relative',
      overflow: 'hidden',
      color: '#FFFFFF',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-md)'
    }} className="animate-fade-in ad-banner-hover">
      
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        right: '-5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(4px)'
      }}>
        <span style={{ color: '#10B981' }}>●</span> FastTrack Remittance
      </div>

      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: 500,
        lineHeight: 1.15,
        color: '#FFFFFF',
        maxWidth: '600px',
        margin: '0 auto',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
      }}>
        Send Money Home to East Africa, Instantly.
      </h2>

      <p style={{
        fontSize: '1.05rem',
        color: 'rgba(255, 255, 255, 0.85)',
        maxWidth: '550px',
        lineHeight: 1.6,
        margin: '0 auto'
      }}>
        The trusted, regulated way to send funds from the US to Somalia, Kenya, and Ethiopia. Zero hidden fees. Powered by secure USDC rails.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-md)',
        justifyContent: 'center',
        marginTop: 'var(--space-sm)',
        position: 'relative',
        zIndex: 2
      }}>
        <a 
          href="https://play.google.com/store/apps/details?id=com.ramadpayinc.ramadpay"
          target="_blank"
          rel="noopener noreferrer"
          className="app-store-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.68504 2.87198C4.3013 3.08051 4.02051 3.53509 4.02051 4.13506V19.864C4.02051 20.463 4.3003 20.9186 4.68404 21.1271L14.4173 11.999L4.68504 2.87198Z" fill="#3DDB84"/>
            <path d="M18.847 14.6291L15.6983 13.2014L14.417 11.999L15.6983 10.7975L18.847 9.36987C19.7891 8.94317 20.5752 9.38096 20.5752 10.3475V13.6515C20.5752 14.618 19.7891 15.0568 18.847 14.6291Z" fill="#3DDB84"/>
            <path d="M15.6981 13.2013L14.4168 11.9989L4.68457 21.127C5.10986 21.4111 5.71917 21.4181 6.43577 21.0927L15.6981 13.2013Z" fill="#3DDB84"/>
            <path d="M15.6981 10.7976L6.43577 2.90623C5.71917 2.58087 5.10986 2.58788 4.68457 2.87196L14.4168 12.0001L15.6981 10.7976Z" fill="#3DDB84"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.65rem', lineHeight: 1, color: 'rgba(255,255,255,0.7)' }}>GET IT ON</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.1 }}>Google Play</span>
          </div>
        </a>
        
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); alert('Apple App Store link coming soon!'); }}
          className="app-store-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '12px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.2)',
            transition: 'var(--transition-smooth)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.159 13.82C17.135 11.233 19.467 9.878 19.57 9.813C18.257 7.915 16.27 7.643 15.617 7.558C14.07 7.4 12.56 8.448 11.758 8.448C10.957 8.448 9.728 7.575 8.423 7.604C6.711 7.632 5.12 8.577 4.237 10.075C2.43 13.152 3.774 17.697 5.535 20.19C6.4 21.411 7.424 22.8 8.784 22.742C10.088 22.685 10.59 21.905 12.158 21.905C13.727 21.905 14.17 22.742 15.53 22.713C16.947 22.685 17.818 21.468 18.675 20.247C19.682 18.799 20.093 17.393 20.12 17.318C20.094 17.307 17.185 16.216 17.159 13.82ZM14.92 5.109C15.645 4.246 16.126 3.036 15.992 1.815C14.945 1.859 13.682 2.508 12.929 3.366C12.251 4.125 11.674 5.358 11.83 6.56C13.003 6.649 14.195 5.972 14.92 5.109Z" fill="#FFFFFF"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.65rem', lineHeight: 1, color: 'rgba(255,255,255,0.7)' }}>Download on the</span>
            <span style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.1 }}>App Store</span>
          </div>
        </a>
      </div>

      <style>{`
        .ad-banner-hover {
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .ad-banner-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(26, 41, 53, 0.2);
        }
        .app-store-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.5) !important;
          background-color: #111111 !important;
        }
        @media (max-width: 640px) {
          .app-store-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
