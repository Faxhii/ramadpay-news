import React, { useState } from 'react';
import type { Article } from '../data/newsData';
import { ArticleCard } from '../components/ArticleCard';
import { Calendar, User, ArrowLeft, MessageSquare, Link, Check } from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  articles: Article[];
  onArticleClick: (slug: string) => void;
  setCurrentPage: (page: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  articles,
  onArticleClick,
  setCurrentPage,
}) => {
  const [copied, setCopied] = useState(false);

  const getCountryFlag = (country: 'Somalia' | 'Kenya' | 'Ethiopia') => {
    switch (country) {
      case 'Somalia': return '🇸🇴';
      case 'Kenya': return '🇰🇪';
      case 'Ethiopia': return '🇪🇹';
      default: return '';
    }
  };

  const getFormattedDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' EAT';
  };

  const batchBadgeClass = article.update_batch === 'morning' ? 'badge-morning' : 'badge-afternoon';

  // Find related stories (same country, excluding current story, limit to 2)
  const relatedStories = articles
    .filter(a => a.country === article.country && a.id !== article.id)
    .slice(0, 2);

  // If no stories in the same country, fallback to same category
  const fallbackRelated = relatedStories.length > 0 
    ? relatedStories 
    : articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCountryBack = () => {
    setCurrentPage(article.country.toLowerCase());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-3xl)' }}>
      
      {/* 1. TOP UTILITY BAR */}
      <section style={{ borderBottom: '1px solid var(--border-color)', padding: 'var(--space-md) 0', backgroundColor: '#FFFFFF' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button 
              onClick={handleBackToHome}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <ArrowLeft size={14} /> Home
            </button>
            <span style={{ color: 'var(--border-color)', fontSize: '0.85rem' }}>|</span>
            <button 
              onClick={handleCountryBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {getCountryFlag(article.country)} {article.country} Bureau
            </button>
          </div>

          {/* Social Share Toolbar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginRight: '4px' }}>Share:</span>
            
            <button 
              onClick={handleCopyLink}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              title="Copy link"
              className="share-button"
            >
              {copied ? <Check size={14} style={{ color: '#10B981' }} /> : <Link size={14} />}
            </button>

            <a 
              href={`https://wa.me/?text=${encodeURIComponent(article.title + ' - ' + window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              title="Share to WhatsApp"
              className="share-button"
            >
              <MessageSquare size={14} />
            </a>

            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              title="Share to X (formerly Twitter)"
              className="share-button"
            >
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>

        </div>
      </section>

      {/* 2. HEADER DETAILS */}
      <section style={{ padding: 'var(--space-2xl) 0 var(--space-xl) 0' }}>
        <div className="container reading-container">
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {getCountryFlag(article.country)} {article.country} &bull; {article.category}
            </span>
            <span className={`badge ${batchBadgeClass}`} style={{ fontSize: '0.65rem' }}>
              {article.update_batch} briefing
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            lineHeight: 1.15,
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-md)'
          }} className="article-detail-title">
            {article.title}
          </h1>

          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.5,
            color: 'var(--text-secondary)',
            fontWeight: 400,
            marginBottom: 'var(--space-lg)',
            borderLeft: '2px solid var(--color-accent)',
            paddingLeft: 'var(--space-md)'
          }}>
            {article.summary}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            paddingBottom: 'var(--space-sm)',
            borderBottom: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} />
              <span>Reported by <strong>{article.source}</strong></span>
            </div>
            <span>&bull;</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              <span>{getFormattedDate(article.published_at)}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HERO IMAGE */}
      <section style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            aspectRatio: '21/9',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <img 
              src={article.image_url} 
              alt={article.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* 4. CONTENT & SIDEBAR */}
      <section style={{ paddingBottom: 'var(--space-2xl)' }}>
        <div className="container reading-container">
          
          {/* Clean bullet points instead of AI branded box */}
          {article.ai_summary_points && article.ai_summary_points.length > 0 && (
            <ul style={{ 
              marginBottom: 'var(--space-xl)', 
              paddingLeft: 'var(--space-lg)',
              fontFamily: 'var(--font-sans)',
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              {article.ai_summary_points.map((point, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>{point}</li>
              ))}
            </ul>
          )}

          {/* Full Article Content */}
          <div className="reading-body" style={{ marginTop: 'var(--space-xl)' }}>
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

        </div>
      </section>

      {/* 5. RELATED STORIES */}
      <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-2xl)', backgroundColor: 'var(--bg-secondary)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: 500,
            marginBottom: 'var(--space-lg)',
            textAlign: 'center'
          }}>
            Related Bureau Coverage
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-xl)'
          }} className="related-grid">
            {fallbackRelated.map(story => (
              <ArticleCard 
                key={story.id}
                article={story}
                onClick={() => onArticleClick(story.slug)}
              />
            ))}
          </div>

        </div>
      </section>

      <style>{`
        .share-button:hover {
          background-color: var(--color-accent-light) !important;
          border-color: var(--color-accent) !important;
          color: var(--color-accent) !important;
        }
        @media (max-width: 640px) {
          .article-detail-title {
            font-size: 1.85rem !important;
          }
          .related-grid {
            grid-template-columns: 1fr !important;
            gap: var(--space-lg) !important;
          }
        }
      `}</style>

    </div>
  );
};
