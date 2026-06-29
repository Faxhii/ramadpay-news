import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Dynamic Header */}
      <Header goHome={goHome} />
      
      {/* Active Page Viewport */}
      <main style={{ flexGrow: 1 }}>
        {renderPage()}
      </main>

      {/* Editorial Footer */}
      <Footer goHome={goHome} />
    </div>
  );
}

export default App;
