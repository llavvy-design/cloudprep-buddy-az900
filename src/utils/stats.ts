import type { Attempt, DomainId } from '../types';
import { DOMAINS, TOPICS } from '../data/curriculum';
import { QUESTIONS } from '../data/questions';

export interface TopicStat {
  topicId: string;
  topicName: string;
  domainId: DomainId;
  attempts: number;
  correct: number;
  accuracy: number;
}

export interface DomainStat {
  domainId: DomainId;
  domainName: string;
  weightRange: string;
  attempts: number;
  correct: number;
  accuracy: number;
  totalAvailableQuestions: number;
}

export interface ReadinessResult {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  hasEnoughData: boolean;
  label: string;
  description: string;
}

const MIN_TOPIC_ATTEMPTS = 3;
const MIN_TOTAL_FOR_READINESS = 10;

export function computeTopicStats(attempts: Attempt[]): TopicStat[] {
  const map = new Map<string, TopicStat>();

  for (const topic of TOPICS) {
    map.set(topic.id, {
      topicId: topic.id,
      topicName: topic.name,
      domainId: topic.domainId,
      attempts: 0,
      correct: 0,
      accuracy: 0,
    });
  }

  for (const a of attempts) {
    const stat = map.get(a.topicId);
    if (!stat) continue;
    stat.attempts += 1;
    if (a.isCorrect) stat.correct += 1;
  }

  for (const stat of map.values()) {
    stat.accuracy = stat.attempts > 0 ? stat.correct / stat.attempts : 0;
  }

  return Array.from(map.values());
}

export function computeDomainStats(attempts: Attempt[]): DomainStat[] {
  return DOMAINS.map((domain) => {
    const domainAttempts = attempts.filter((a) => a.domainId === domain.id);
    const correct = domainAttempts.filter((a) => a.isCorrect).length;
    const total = domainAttempts.length;
    return {
      domainId: domain.id,
      domainName: domain.name,
      weightRange: domain.weightRange,
      attempts: total,
      correct,
      accuracy: total > 0 ? correct / total : 0,
      totalAvailableQuestions: QUESTIONS.filter((q) => q.domainId === domain.id).length,
    };
  });
}

export function computeReadiness(attempts: Attempt[]): ReadinessResult {
  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;

  if (totalAnswered < MIN_TOTAL_FOR_READINESS) {
    return {
      totalAnswered,
      totalCorrect,
      accuracy,
      hasEnoughData: false,
      label: 'Not enough practice data yet',
      description: `Answer at least 10 questions to see a readiness indicator. You have answered ${totalAnswered} so far.`,
    };
  }

  let label = 'Needs more revision';
  let description = 'Keep practising — focus on the topics with the lowest accuracy first.';
  if (accuracy >= 0.8) {
    label = 'Strong practice performance';
    description = 'You are consistently answering most questions correctly across topics you have practised.';
  } else if (accuracy >= 0.6) {
    label = 'Building confidence';
    description = 'You are making good progress. A bit more practice on weaker topics will strengthen your readiness.';
  }

  return {
    totalAnswered,
    totalCorrect,
    accuracy,
    hasEnoughData: true,
    label,
    description,
  };
}

export interface WeakTopicResult {
  topic?: TopicStat;
  reason: string;
}

export function recommendWeakTopic(attempts: Attempt[]): WeakTopicResult {
  const topicStats = computeTopicStats(attempts);
  const adequate = topicStats.filter((s) => s.attempts >= MIN_TOPIC_ATTEMPTS);

  if (adequate.length === 0) {
    return { reason: 'no-data' };
  }

  if (adequate.length === 1) {
    return {
      topic: adequate[0],
      reason: 'only-one',
    };
  }

  const sorted = [...adequate].sort((a, b) => a.accuracy - b.accuracy);
  const lowest = sorted[0];
  const next = sorted.slice(1);
  const othersAvg = next.reduce((sum, s) => sum + s.accuracy, 0) / next.length;

  if (lowest.accuracy < othersAvg) {
    return { topic: lowest, reason: 'weakest' };
  }

  return { reason: 'none-clearly-weaker' };
}

export function getIncorrectAttempts(attempts: Attempt[]): Attempt[] {
  return attempts.filter((a) => !a.isCorrect);
}

export function getLatestAttemptPerQuestion(attempts: Attempt[]): Map<string, Attempt> {
  const map = new Map<string, Attempt>();
  for (const a of attempts) {
    const existing = map.get(a.questionId);
    if (!existing || a.timestamp > existing.timestamp) {
      map.set(a.questionId, a);
    }
  }
  return map;
}
