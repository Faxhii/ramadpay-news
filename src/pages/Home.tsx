import React from 'react';
import type { Article } from '../data/newsData';
import { ArticleCard } from '../components/ArticleCard';

interface HomeProps {
  articles: Article[];
  onArticleClick: (slug: string) => void;
}

export const Home: React.FC<HomeProps> = ({ articles, onArticleClick }) => {
  return (
    <div style={{ padding: '32px' }} className="home-wrapper">
      
      <h2 style={{ 
        fontFamily: 'var(--font-serif)', 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: 'var(--text-primary)', 
        marginBottom: '32px',
        textAlign: 'center',
        lineHeight: 1.3
      }}>
        Your Daily Source for Breaking Somalia &amp; Somali Diaspora News
      </h2>

      {/* 3-Column Masonry/Grid Feed */}
      <div className="home-grid">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article.id}
            article={article}
            index={index + 1}
            onClick={() => onArticleClick(article.slug)}
          />
        ))}
      </div>

    </div>
  );
};
