import React from 'react';
import type { Article } from '../data/newsData';

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index, onClick }) => {
  // Format the time (e.g. 04:22 AM)
  const pubDate = article.published_at || new Date().toISOString();
  const dateObj = new Date(pubDate);
  const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <article 
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid var(--border-light)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top Image Area */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#F1F5F9' }}>
        {article.image_url && (
          <img 
            src={article.image_url} 
            alt={article.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )}
        
        {/* Number Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          {index}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
        
        {/* Meta Row: Category & Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            color: '#10B981', 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase' 
          }}>
            {article.category}
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 500 }}>
            {timeString}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.1rem', 
          lineHeight: 1.4, 
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-serif)',
          fontWeight: 500
        }}>
          {article.title}
        </h3>

        {/* Snippet */}
        <p style={{ 
          margin: 0, 
          fontSize: '0.85rem', 
          lineHeight: 1.6, 
          color: 'var(--text-secondary)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {article.summary}
        </p>
      </div>
    </article>
  );
};
