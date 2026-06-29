import React from 'react';
import type { Article } from '../data/newsData';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterSignup } from '../components/NewsletterSignup';
import { AdBanner } from '../components/AdBanner';

interface HomeProps {
  articles: Article[];
  onArticleClick: (slug: string) => void;
}

export const Home: React.FC<HomeProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="animate-fade-in">
      
      {/* HERO SECTION */}
      <section style={{ 
        padding: 'var(--space-2xl) 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-md)'
          }}>
            East Africa <br />
            <span style={{ color: 'var(--color-accent)' }}>Intelligence Brief</span>
          </h1>
          <p style={{ 
            fontSize: '1.125rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            A curated, automated intelligence briefing covering the latest developments across East Africa.
          </p>
        </div>
      </section>

      {/* AD BANNER SECTION */}
      <section className="section-padding" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <AdBanner />
        </div>
      </section>

      {/* SINGLE COLUMN FEED */}
      <section className="section-padding">
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            {articles.map((article) => (
              <ArticleCard 
                key={article.id}
                article={article}
                onClick={() => onArticleClick(article.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP AREA */}
      <section className="section-padding" style={{ marginTop: 'var(--space-2xl)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <NewsletterSignup />
        </div>
      </section>

    </div>
  );
};
