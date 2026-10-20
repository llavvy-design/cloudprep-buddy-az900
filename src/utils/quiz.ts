import type { Question } from '../types';

export function shuffle<T>(input: T[]): T[] {
  const arr = input.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface QuizConfig {
  domainId: string | 'all';
  topicId: string | 'all';
  count: number | 'all';
  difficulty: 'all' | 'foundation' | 'intermediate';
}

export interface QuizBuildResult {
  questions: Question[];
  requestedCount: number | 'all';
  availableCount: number;
  usedAvailable: boolean;
}

export function buildQuiz(allQuestions: Question[], config: QuizConfig): QuizBuildResult {
  let pool = allQuestions.slice();

  if (config.domainId !== 'all') {
    pool = pool.filter((q) => q.domainId === config.domainId);
  }
  if (config.topicId !== 'all') {
    pool = pool.filter((q) => q.topicId === config.topicId);
  }
  if (config.difficulty !== 'all') {
    pool = pool.filter((q) => q.difficulty === config.difficulty);
  }

  const availableCount = pool.length;
  const shuffled = shuffle(pool);

  let selected: Question[];
  let usedAvailable = false;

  if (config.count === 'all') {
    selected = shuffled;
    usedAvailable = true;
  } else {
    if (availableCount <= config.count) {
      selected = shuffled;
      usedAvailable = true;
    } else {
      selected = shuffled.slice(0, config.count);
    }
  }

  return {
    questions: selected,
    requestedCount: config.count,
    availableCount,
    usedAvailable,
  };
}
