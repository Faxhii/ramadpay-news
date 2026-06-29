import React from 'react';
import type { Article } from '../data/newsData';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterSignup } from '../components/NewsletterSignup';

interface HomeProps {
  articles: Article[];
  onArticleClick: (slug: string) => void;
}

export const Home: React.FC<HomeProps> = ({ articles, onArticleClick }) => {
  return (
    <div className="animate-fade-in" style={{ paddingBottom: 'var(--space-3xl)' }}>
      
      {/* MINIMAL FEED HEADER */}
      <section style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-lg)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '3rem',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: 'var(--space-sm)'
          }}>
            The Regional Feed
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            A curated, automated intelligence briefing covering the latest developments across East Africa.
          </p>
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
                layout="horizontal"
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
