import { useEffect, useState } from 'react';
import type { PageId } from './types';
import { useProgress, useBookmarks, useTheme } from './hooks/useStorage';
import { Sidebar, MobileMenuButton } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { PracticePage } from './pages/PracticePage';
import { LearnPage } from './pages/LearnPage';
import { ProgressPage } from './pages/ProgressPage';

function App() {
  const { progress, addAttempt, resetProgress } = useProgress();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { theme, toggleTheme } = useTheme();

  const [page, setPage] = useState<PageId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [practiseTopicId, setPractiseTopicId] = useState<string | null>(null);
  const [retryMissedSignal, setRetryMissedSignal] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const navigate = (next: PageId) => {
    setPage(next);
    setMobileMenuOpen(false);
  };

  const practiseTopic = (topicId: string) => {
    setPractiseTopicId(topicId);
    setPage('practice');
    setMobileMenuOpen(false);
  };

  const retryMissed = () => {
    setRetryMissedSignal((n) => n + 1);
    setPractiseTopicId(null);
    setPage('practice');
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30"
        style={{ borderRight: '1px solid var(--border)' }}
      >
        <Sidebar
          active={page}
          onNavigate={navigate}
          theme={theme.theme}
          onToggleTheme={toggleTheme}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] cpb-scale-in"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            <Sidebar
              active={page}
              onNavigate={navigate}
              theme={theme.theme}
              onToggleTheme={toggleTheme}
              isMobile
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header
          className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
          <span className="font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            CloudPrep<span style={{ color: 'var(--orange)' }}> Buddy</span>
          </span>
          <button
            className="btn btn-ghost !p-2 !min-h-0"
            style={{ width: 40, height: 40 }}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme.theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme.theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {page === 'home' && (
            <HomePage
              attempts={progress.attempts}
              bookmarkCount={bookmarks.conceptIds.length}
              onNavigate={navigate}
              onPractiseTopic={practiseTopic}
            />
          )}
          {page === 'practice' && (
            <PracticePage
              key={`practice-${practiseTopicId ?? 'none'}-${retryMissedSignal}`}
              attempts={progress.attempts}
              onAddAttempt={addAttempt}
              onNavigate={navigate}
              preselectTopicId={practiseTopicId}
              retryMissedSignal={retryMissedSignal}
            />
          )}
          {page === 'learn' && (
            <LearnPage
              bookmarkedIds={bookmarks.conceptIds}
              onToggleBookmark={toggleBookmark}
              isBookmarked={isBookmarked}
              onNavigate={navigate}
            />
          )}
          {page === 'progress' && (
            <ProgressPage
              attempts={progress.attempts}
              onReset={resetProgress}
              onNavigate={navigate}
              onPractiseTopic={practiseTopic}
              onRetryMissed={retryMissed}
            />
          )}
        </main>

        <footer
          className="px-4 sm:px-6 lg:px-8 py-6 text-center text-xs"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
        >
          CloudPrep Buddy · Independent, unofficial AZ-900 learning tool · Progress stored only in
          this browser
        </footer>
      </div>
    </div>
  );
}

export default App;
