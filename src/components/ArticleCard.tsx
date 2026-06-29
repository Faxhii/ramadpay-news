import React from 'react';
import type { Article } from '../data/newsData';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const getPublishedTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Modern Minimal Horizontal Card
  return (
    <div 
      onClick={onClick}
      className="minimal-horizontal-card animate-fade-in"
      style={{ 
        cursor: 'pointer',
        display: 'flex',
        gap: 'var(--space-xl)',
        alignItems: 'center'
      }}
    >
      <div style={{ 
        width: '45%', 
        flexShrink: 0, 
        borderRadius: 'var(--radius-lg)', 
        overflow: 'hidden'
      }}>
        <img 
          src={article.image_url} 
          alt={article.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '4/3' }} 
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {article.category}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>&bull;</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {getPublishedTime(article.published_at)}
          </span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 500, lineHeight: 1.2, color: 'var(--text-primary)', margin: '4px 0' }}>
          {article.title}
        </h3>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
          {article.summary}
        </p>
      </div>

      <style>{`
        .minimal-horizontal-card h3 {
          transition: color 0.2s ease;
        }
        .minimal-horizontal-card:hover h3 {
          color: var(--color-accent);
        }
        .minimal-horizontal-card img {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .minimal-horizontal-card:hover img {
          transform: scale(1.04);
        }
        @media (max-width: 768px) {
          .minimal-horizontal-card {
            flex-direction: column !important;
            gap: var(--space-md) !important;
            align-items: flex-start !important;
            padding-bottom: var(--space-lg);
            border-bottom: 1px solid var(--border-light);
          }
          .minimal-horizontal-card > div:first-child {
            width: 100% !important;
          }
          .minimal-horizontal-card h3 {
            font-size: 1.4rem !important;
          }
        }
      `}</style>
    </div>
  );
};
