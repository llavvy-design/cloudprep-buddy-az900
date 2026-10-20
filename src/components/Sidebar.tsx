import { Home, BookOpen, GraduationCap, BarChart3, Cloud, Sun, Moon, Menu, X } from 'lucide-react';
import type { PageId } from '../types';
import { Wordmark } from './Wordmark';

interface SidebarProps {
  active: PageId;
  onNavigate: (page: PageId) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof Home; description: string }[] = [
  { id: 'home', label: 'Home', icon: Home, description: 'Your study overview' },
  { id: 'practice', label: 'Practice', icon: GraduationCap, description: 'Take quizzes' },
  { id: 'learn', label: 'Learn', icon: BookOpen, description: 'Concept library' },
  { id: 'progress', label: 'Progress', icon: BarChart3, description: 'Your readiness' },
];

export function Sidebar({
  active,
  onNavigate,
  theme,
  onToggleTheme,
  onCloseMobile,
  isMobile,
}: SidebarProps) {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between px-5 py-5">
        <button
          className="text-left"
          onClick={() => handleNav('home')}
          aria-label="CloudPrep Buddy home"
        >
          <Wordmark size={isMobile ? 'sm' : 'md'} />
        </button>
        {isMobile && (
          <button
            className="btn-ghost btn !p-2 !min-h-0"
            style={{ width: 36, height: 36 }}
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 pb-3 overflow-y-auto" aria-label="Main navigation">
        <div className="px-2 pt-2 pb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          Study areas
        </div>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                className="nav-link"
                data-active={isActive}
                onClick={() => handleNav(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className="nav-dot shrink-0 rounded-full"
                  style={{
                    width: 8,
                    height: 8,
                    background: isActive ? 'var(--orange)' : 'transparent',
                    border: isActive ? 'none' : '1px solid var(--border-strong)',
                  }}
                  aria-hidden="true"
                />
                <Icon size={18} style={{ color: isActive ? 'var(--orange)' : 'var(--text-soft)' }} />
                <span className="flex-1">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 px-3 py-3 rounded-xl" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-soft)' }}>
            <Cloud size={14} style={{ color: 'var(--sage)' }} />
            Unofficial AZ-900 tool
          </div>
          <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Independent learning project. Not affiliated with or endorsed by Microsoft.
          </p>
        </div>
      </nav>

      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          className="btn btn-outline w-full"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          {theme === 'light' ? 'Dark theme' : 'Light theme'}
        </button>
      </div>
    </div>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="btn btn-ghost !p-2 !min-h-0 lg:hidden"
      style={{ width: 40, height: 40 }}
      onClick={onClick}
      aria-label="Open menu"
    >
      <Menu size={20} />
    </button>
  );
}
