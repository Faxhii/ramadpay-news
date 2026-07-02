import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { newsArticles as mockArticles } from './data/newsData';
import { FileText, Rss } from 'lucide-react';

function App() {
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string | null>(null);

  // Navigate to article page
  const handleArticleClick = (slug: string) => {
    setCurrentArticleSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentArticleSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (currentArticleSlug) {
      const selectedArticle = mockArticles.find(a => a.slug === currentArticleSlug);
      if (selectedArticle) {
        return (
          <ArticleDetail
            article={selectedArticle}
            articles={mockArticles}
            onArticleClick={handleArticleClick}
            setCurrentPage={goHome}
          />
        );
      }
    }

    return (
      <Home
        articles={mockArticles}
        onArticleClick={handleArticleClick}
      />
    );
  };

  return (
    <div className={`app-container ${currentArticleSlug ? 'is-article-view' : ''}`}>
      {/* Left Sidebar */}
      <Sidebar className="main-sidebar" />
      
      {/* Main Content Area */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Top App Bar Header (from screenshot) */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-light)',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            background: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            <FileText size={16} /> Read Latest Briefing
          </button>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            background: '#FFFFFF',
            fontSize: '0.85rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            <Rss size={16} /> Feed
          </button>
        </header>

        {renderPage()}
        
        {/* Mobile Bottom Sidebar */}
        <Sidebar className="mobile-bottom-sidebar" />
      </main>
    </div>
  );
}

export default App;
