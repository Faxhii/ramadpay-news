import React, { useState, useEffect } from 'react';

const apps = [
  {
    id: 'us',
    badge: 'FASTTRACK REMITTANCE (US)',
    badgeColor: '#10B981',
    title: 'Ramadpay US',
    description: 'Send money instantly from the US to Somalia, Kenya, and Ethiopia. Zero hidden fees, transparent exchange rates, and real-time tracking.',
    links: {
      android: 'https://play.google.com/store/apps/details?id=com.ramadpayinc.ramadpay',
      ios: 'https://apps.apple.com/us/app/ramad-pay-inc/id6738033866',
      web: 'https://ramadpay.com'
    }
  },
  {
    id: 'canada',
    badge: 'CANADIAN TRANSFERS (CAD)',
    badgeColor: '#F59E0B',
    title: 'Ramad Pay Canada',
    description: 'Send CAD from Canada to East Africa via mobile money & secure cash pickup. Transparent FX, low fees, and 24/7 transfers.',
    links: {
      android: 'https://play.google.com/store/apps/details?id=com.ramadpayinc.ramadpaycanada',
      ios: 'https://apps.apple.com/us/app/ramad-pay-inc/id6738033866',
      web: 'https://ramadpay.com'
    }
  },
  {
    id: 'rcash',
    badge: 'CROSS-BORDER INFRASTRUCTURE',
    badgeColor: '#3B82F6',
    title: 'R-Cash',
    description: 'The premier payment bridge for East Africa. Send USD, KES, and ETB between Kenya, Somalia, and Ethiopia with bank-grade security.',
    links: {
      android: 'https://play.google.com/store/apps/details?id=com.r_cash.io&hl=en_IN',
      ios: 'https://apps.apple.com/us/app/r-cashio/id6748802965',
      web: 'https://r-cash.io'
    }
  }
];

export const AdBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % apps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(180deg, #1f2d3d 0%, #162432 100%)',
      borderRadius: '12px',
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
      color: '#FFFFFF',
      border: '1px solid rgba(255,255,255,0.05)',
      minHeight: '400px'
    }}>
      {apps.map((app, index) => {
        const isActive = index === currentIndex;
        return (
          <div 
            key={app.id}
            style={{
              position: isActive ? 'relative' : 'absolute',
              top: isActive ? 'auto' : '24px',
              left: isActive ? 'auto' : '16px',
              right: isActive ? 'auto' : '16px',
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              transition: 'opacity 0.8s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: isActive ? 2 : 1
            }}
          >
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <span style={{ color: app.badgeColor }}>●</span> {app.badge}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 500,
          lineHeight: 1.2,
          color: '#FFFFFF',
          margin: 0
        }}>
          {app.title}
        </h2>

        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.7)',
          lineHeight: 1.5,
          margin: 0
        }}>
          {app.description}
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '8px'
        }}>
          {app.links.android && (
            <a
              href={app.links.android}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-app-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.68504 2.87198C4.3013 3.08051 4.02051 3.53509 4.02051 4.13506V19.864C4.02051 20.463 4.3003 20.9186 4.68404 21.1271L14.4173 11.999L4.68504 2.87198Z" fill="#3DDB84" />
                <path d="M18.847 14.6291L15.6983 13.2014L14.417 11.999L15.6983 10.7975L18.847 9.36987C19.7891 8.94317 20.5752 9.38096 20.5752 10.3475V13.6515C20.5752 14.618 19.7891 15.0568 18.847 14.6291Z" fill="#3DDB84" />
                <path d="M15.6981 13.2013L14.4168 11.9989L4.68457 21.127C5.10986 21.4111 5.71917 21.4181 6.43577 21.0927L15.6981 13.2013Z" fill="#3DDB84" />
                <path d="M15.6981 10.7976L6.43577 2.90623C5.71917 2.58087 5.10986 2.58788 4.68457 2.87196L14.4168 12.0001L15.6981 10.7976Z" fill="#3DDB84" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.55rem', lineHeight: 1, color: 'rgba(255,255,255,0.6)' }}>GET IT ON</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.1 }}>Google Play</span>
              </div>
            </a>
          )}

          {app.links.ios && (
            <a
              href={app.links.ios}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-app-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.159 13.82C17.135 11.233 19.467 9.878 19.57 9.813C18.257 7.915 16.27 7.643 15.617 7.558C14.07 7.4 12.56 8.448 11.758 8.448C10.957 8.448 9.728 7.575 8.423 7.604C6.711 7.632 5.12 8.577 4.237 10.075C2.43 13.152 3.774 17.697 5.535 20.19C6.4 21.411 7.424 22.8 8.784 22.742C10.088 22.685 10.59 21.905 12.158 21.905C13.727 21.905 14.17 22.742 15.53 22.713C16.947 22.685 17.818 21.468 18.675 20.247C19.682 18.799 20.093 17.393 20.12 17.318C20.094 17.307 17.185 16.216 17.159 13.82ZM14.92 5.109C15.645 4.246 16.126 3.036 15.992 1.815C14.945 1.859 13.682 2.508 12.929 3.366C12.251 4.125 11.674 5.358 11.83 6.56C13.003 6.649 14.195 5.972 14.92 5.109Z" fill="#FFFFFF" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.55rem', lineHeight: 1, color: 'rgba(255,255,255,0.6)' }}>Download on the</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.1 }}>App Store</span>
              </div>
            </a>
          )}
          
          {app.links.web && (
            <a
              href={app.links.web}
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-app-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                transition: 'var(--transition-smooth)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.55rem', lineHeight: 1, color: 'rgba(255,255,255,0.6)' }}>Visit Website</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.1 }}>Learn More</span>
              </div>
            </a>
          )}
        </div>
      </div>
    );
  })}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .sidebar-app-btn:hover {
          background-color: rgba(255,255,255,0.1) !important;
          border-color: rgba(255,255,255,0.3) !important;
        }
      `}</style>
    </div>
  );
};
