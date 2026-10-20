import { useEffect, useState, useCallback } from 'react';
import type { Attempt, ProgressState, BookmarksState, ThemeState } from '../types';

const PROGRESS_KEY = 'cpb.progress.v1';
const BOOKMARKS_KEY = 'cpb.bookmarks.v1';
const THEME_KEY = 'cpb.theme.v1';

const CURRENT_VERSION = 1;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (quota, private mode)
  }
}

// ---------------- Progress ----------------

const emptyProgress: ProgressState = { version: CURRENT_VERSION, attempts: [] };

function loadProgress(): ProgressState {
  const data = readJSON<ProgressState>(PROGRESS_KEY, emptyProgress);
  if (!data || typeof data !== 'object' || !Array.isArray(data.attempts)) {
    return emptyProgress;
  }
  return { version: CURRENT_VERSION, attempts: data.attempts.filter(isValidAttempt) };
}

function isValidAttempt(a: unknown): a is Attempt {
  if (!a || typeof a !== 'object') return false;
  const x = a as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    typeof x.questionId === 'string' &&
    typeof x.isCorrect === 'boolean' &&
    typeof x.timestamp === 'number'
  );
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    writeJSON(PROGRESS_KEY, progress);
  }, [progress]);

  const addAttempt = useCallback((attempt: Attempt) => {
    setProgress((prev) => ({
      version: CURRENT_VERSION,
      attempts: [...prev.attempts, attempt],
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ version: CURRENT_VERSION, attempts: [] });
  }, []);

  return { progress, addAttempt, resetProgress };
}

// ---------------- Bookmarks ----------------

const emptyBookmarks: BookmarksState = { version: CURRENT_VERSION, conceptIds: [] };

function loadBookmarks(): BookmarksState {
  const data = readJSON<BookmarksState>(BOOKMARKS_KEY, emptyBookmarks);
  if (!data || !Array.isArray(data.conceptIds)) return emptyBookmarks;
  return { version: CURRENT_VERSION, conceptIds: data.conceptIds.filter((x) => typeof x === 'string') };
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarksState>(() => loadBookmarks());

  useEffect(() => {
    writeJSON(BOOKMARKS_KEY, bookmarks);
  }, [bookmarks]);

  const toggleBookmark = useCallback((conceptId: string) => {
    setBookmarks((prev) => {
      const has = prev.conceptIds.includes(conceptId);
      return {
        version: CURRENT_VERSION,
        conceptIds: has
          ? prev.conceptIds.filter((id) => id !== conceptId)
          : [...prev.conceptIds, conceptId],
      };
    });
  }, []);

  const isBookmarked = useCallback(
    (conceptId: string) => bookmarks.conceptIds.includes(conceptId),
    [bookmarks.conceptIds]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}

// ---------------- Theme ----------------

function loadTheme(): ThemeState {
  const data = readJSON<ThemeState>(THEME_KEY, { version: CURRENT_VERSION, theme: 'light' });
  if (!data || (data.theme !== 'light' && data.theme !== 'dark')) {
    return { version: CURRENT_VERSION, theme: 'light' };
  }
  return { version: CURRENT_VERSION, theme: data.theme };
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => loadTheme());

  useEffect(() => {
    writeJSON(THEME_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme.theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      version: CURRENT_VERSION,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  }, []);

  return { theme, toggleTheme };
}
