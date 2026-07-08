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

  // Only show articles from the last 48 hours on the homepage — no stale news
  const cutoff48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const sortedArticles = [...mockArticles]
    .filter(a => new Date(a.published_at) >= cutoff48h)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  // All articles (for article detail related stories — can reference older ones)
  const allArticlesSorted = [...mockArticles].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const renderPage = () => {
    if (currentArticleSlug) {
      // For article detail, search all articles (not just 48h) so direct links still work
      const selectedArticle = allArticlesSorted.find(a => a.slug === currentArticleSlug);
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
      <GlobalHeader 
        onReadLatest={() => {
          if (sortedArticles.length > 0) {
            handleArticleClick(sortedArticles[0].slug);
          }
        }}
        onFeedClick={goHome}
      />
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
