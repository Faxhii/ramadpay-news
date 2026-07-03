import { useState } from 'react';
import { GlobalHeader } from './components/GlobalHeader';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { ArticleDetail } from './pages/ArticleDetail';
import { newsArticles as mockArticles } from './data/newsData';

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

  const sortedArticles = [...mockArticles].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const renderPage = () => {
    if (currentArticleSlug) {
      const selectedArticle = sortedArticles.find(a => a.slug === currentArticleSlug);
      if (selectedArticle) {
        return (
          <ArticleDetail
            article={selectedArticle}
            articles={sortedArticles}
            onArticleClick={handleArticleClick}
            setCurrentPage={goHome}
          />
        );
      }
    }

    return (
      <Home
        articles={sortedArticles}
        onArticleClick={handleArticleClick}
      />
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlobalHeader />
      <div className={`app-container ${currentArticleSlug ? 'is-article-view' : ''}`}>
        {/* Left Sidebar */}
        <Sidebar className="main-sidebar" />
        
        {/* Main Content Area */}
        <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
          
          {renderPage()}
        
        {/* Mobile Bottom Sidebar */}
        <Sidebar className="mobile-bottom-sidebar" />
        </main>
      </div>
    </div>
  );
}

export default App;
