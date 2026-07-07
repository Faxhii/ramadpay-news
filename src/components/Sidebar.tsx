import React from 'react';
import { AdBanner } from './AdBanner';
import { Clock, ExternalLink } from 'lucide-react';

const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" /></svg>
);
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const YoutubeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const TikTokIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);

export const Sidebar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <aside className={`sidebar-container ${className}`}>
      
      <div className="sidebar-top-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
        {/* Embedded Ad Banner */}
      <AdBanner />
      </div>

      <div className="sidebar-bottom-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', flexGrow: 1 }}>
        {/* Social Media Crawling Section */}
        <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        <h3 style={{ 
          color: '#60a5fa', 
          fontSize: '0.8rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          fontWeight: 700 
        }}>
          Social Media Crawling
        </h3>
        
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Real-time updates from social platforms and news sources.
        </p>

        <a href="#" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: '4px',
          color: '#FFFFFF',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 500,
          marginTop: '4px',
          transition: 'var(--transition-smooth)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}>
          View Live Feed <ExternalLink size={14} />
        </a>

        {/* Social Icons Row */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {[
            { Icon: TwitterIcon, bg: '#000000', title: 'Search on Twitter', url: 'https://twitter.com/search?q=somali+politics' },
            { Icon: FacebookIcon, bg: '#1877F2', title: 'Search on Facebook', url: 'https://www.facebook.com/hashtag/SomaliPolitics' },
            { Icon: InstagramIcon, bg: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', title: 'Search on Instagram', url: 'https://www.instagram.com/explore/tags/SomaliPolitics/' },
            { Icon: YoutubeIcon, bg: '#FF0000', title: 'Search on Youtube', url: 'https://www.youtube.com/results?search_query=somali+politics' },
            { Icon: TikTokIcon, bg: '#000000', title: 'Search on TikTok', url: 'https://www.tiktok.com/search?q=somali+politics' }
          ].map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noreferrer" title={item.title} style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: item.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              border: item.bg === '#000000' ? '1px solid rgba(255,255,255,0.2)' : 'none',
              textDecoration: 'none'
            }}>
              <item.Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginTop: 'var(--space-md)'
      }}>
        <h3 style={{ 
          color: 'rgba(255,255,255,0.6)', 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em',
          fontWeight: 600,
          marginBottom: '4px'
        }}>
          Trending Topics
        </h3>
        
        {['#SomaliaAid', '#AlShabab', '#SomaliaPolitics', '#Humanitarian', '#IHL2026'].map((tag) => (
          <div key={tag} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.9)',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
          className="trending-tag"
          >
            {tag}
            <span style={{ color: '#10B981' }}>↗</span>
          </div>
        ))}
      </div>

      {/* Footer Meta */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-xl)' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '8px' }}>
          Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (US ET)
        </p>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '6px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '0.75rem',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '4px 8px',
          borderRadius: '4px'
        }}>
          <Clock size={12} /> Auto-updated every 1 hour
        </div>
      </div>
      
      </div>

      <style>{`
        .trending-tag:hover {
          color: #10B981 !important;
        }
        /* Hide scrollbar for sidebar */
        aside::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </aside>
  );
};
