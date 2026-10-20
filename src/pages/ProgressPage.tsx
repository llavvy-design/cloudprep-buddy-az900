import { useMemo, useState } from 'react';
import {
  BarChart3,
  Target,
  TrendingUp,
  Trash2,
  RotateCcw,
  GraduationCap,
  Check,
  X,
  HelpCircle,
  Cloud,
  AlertTriangle,
  Compass,
} from 'lucide-react';
import type { PageId, Attempt } from '../types';
import { DOMAINS } from '../data/curriculum';
import { QUESTIONS, getQuestion } from '../data/questions';
import {
  computeTopicStats,
  computeReadiness,
  recommendWeakTopic,
  getIncorrectAttempts,
} from '../utils/stats';
import { PageHeader } from '../components/PageHeader';
import { StatCard, ProgressBar, EmptyState } from '../components/ui';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { OfficialResources, Disclaimer } from '../components/OfficialResources';

interface ProgressPageProps {
  attempts: Attempt[];
  onReset: () => void;
  onNavigate: (page: PageId) => void;
  onPractiseTopic: (topicId: string) => void;
  onRetryMissed: () => void;
}

export function ProgressPage({ attempts, onReset, onNavigate, onPractiseTopic, onRetryMissed }: ProgressPageProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const readiness = computeReadiness(attempts);
  const topicStats = useMemo(() => computeTopicStats(attempts), [attempts]);
  const weak = useMemo(() => recommendWeakTopic(attempts), [attempts]);
  const incorrect = useMemo(() => getIncorrectAttempts(attempts), [attempts]);

  const practisedTopics = topicStats.filter((s) => s.attempts > 0);

  return (
    <div className="cpb-fade-in">
      <PageHeader
        title="Progress"
        subtitle="Calculated only from the answers you have actually submitted."
        icon={<BarChart3 size={22} />}
        actions={
          totalAnswered > 0 ? (
            <button
              className="btn btn-outline"
              style={{ color: 'var(--error)', borderColor: 'var(--border-strong)' }}
              onClick={() => setConfirmReset(true)}
            >
              <Trash2 size={16} />
              Reset progress
            </button>
          ) : undefined
        }
      />

      {totalAnswered === 0 ? (
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="No practice data yet"
          message="Take a quiz to start building your progress. Every question you submit will appear here as real data — no sample statistics."
          action={
            <button className="btn btn-primary" onClick={() => onNavigate('practice')}>
              <GraduationCap size={18} />
              Start practising
            </button>
          }
        />
      ) : (
        <>
          {/* Summary */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Questions answered"
              value={totalAnswered}
              icon={<HelpCircle size={16} />}
              accent="orange"
            />
            <StatCard
              label="Correct answers"
              value={totalCorrect}
              icon={<Check size={16} />}
              accent="sage"
            />
            <StatCard
              label="Accuracy"
              value={Math.round(accuracy * 100) + '%'}
              hint={`${totalCorrect} of ${totalAnswered}`}
              icon={<Target size={16} />}
            />
            <StatCard
              label="Topics practised"
              value={practisedTopics.length}
              icon={<Compass size={16} />}
            />
          </section>

          {/* Readiness */}
          <section className="surface p-5 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} style={{ color: 'var(--sage)' }} />
              <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                Practice readiness
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center justify-center rounded-2xl shrink-0"
                style={{
                  width: 64,
                  height: 64,
                  background: readiness.hasEnoughData
                    ? readiness.label === 'Strong practice performance'
                      ? 'var(--sage-soft)'
                      : 'var(--orange-soft)'
                    : 'var(--surface-2)',
                  color: readiness.hasEnoughData
                    ? readiness.label === 'Strong practice performance'
                      ? 'var(--sage-strong)'
                      : 'var(--orange-strong)'
                    : 'var(--text-muted)',
                }}
              >
                <Cloud size={28} />
              </div>
              <div>
                <div className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>
                  {readiness.label}
                </div>
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                  {readiness.description}
                </p>
              </div>
            </div>
            <div
              className="mt-4 flex items-start gap-2 p-3 rounded-lg text-xs"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                This is only an indicator from this app based on your practice attempts. It is not
                an official score, a guaranteed pass, or a reliable prediction of your real exam
                result.
              </span>
            </div>
          </section>

          {/* Weak topic + actions */}
          <section className="grid gap-4 lg:grid-cols-3 mt-6">
            <div className="surface p-5 lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} style={{ color: 'var(--orange)' }} />
                <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  Recommended focus
                </h2>
              </div>
              {weak.reason === 'no-data' && (
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                  Answer at least 3 questions in any topic before a recommendation can be made, so
                  the suggestion is based on real data rather than chance.
                </p>
              )}
              {weak.topic && weak.reason === 'only-one' && (
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    You have practised only one topic so far. Try other topics to compare your
                    performance across the syllabus.
                  </p>
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                      {weak.topic.topicName}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {weak.topic.correct} of {weak.topic.attempts} correct ·{' '}
                      {Math.round(weak.topic.accuracy * 100)}% accuracy
                    </div>
                  </div>
                </div>
              )}
              {weak.topic && weak.reason === 'weakest' && (
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                    This topic has at least 3 attempts and the lowest accuracy of your practised
                    topics:
                  </p>
                  <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                      {weak.topic.topicName}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {weak.topic.correct} of {weak.topic.attempts} correct ·{' '}
                      {Math.round(weak.topic.accuracy * 100)}% accuracy
                    </div>
                  </div>
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => onPractiseTopic(weak.topic!.topicId)}
                  >
                    <GraduationCap size={16} />
                    Practise this topic
                  </button>
                </div>
              )}
              {weak.reason === 'none-clearly-weaker' && (
                <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                  No single topic stands out as weaker — your accuracy is fairly even across the
                  topics with enough data. Keep practising to broaden coverage.
                </p>
              )}
            </div>

            <div className="surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <RotateCcw size={18} style={{ color: 'var(--sage)' }} />
                <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  Missed questions
                </h2>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                You have answered{' '}
                <strong style={{ color: 'var(--error)' }}>{incorrect.length}</strong>{' '}
                question{incorrect.length === 1 ? '' : 's'} incorrectly across all sessions.
              </p>
              <button
                className="btn btn-outline w-full mt-3"
                disabled={incorrect.length === 0}
                onClick={onRetryMissed}
              >
                <RotateCcw size={16} />
                Retry missed questions
              </button>
              <button
                className="btn btn-ghost w-full mt-2"
                onClick={() => onNavigate('practice')}
              >
                <GraduationCap size={16} />
                Start a new quiz
              </button>
            </div>
          </section>

          {/* Topic performance */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Topic performance
            </h2>
            <div className="surface p-4 sm:p-5">
              <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                Topics need at least 3 attempts before they can be judged weak or strong. Below,
                topics with fewer attempts are marked "needs more data".
              </p>
              <div className="space-y-3">
                {DOMAINS.map((domain) => {
                  const domainTopics = topicStats.filter((s) => s.domainId === domain.id);
                  const hasAny = domainTopics.some((s) => s.attempts > 0);
                  return (
                    <div key={domain.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                          {domain.shortName}
                        </h3>
                        <span className="chip" style={{ background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }}>
                          {domain.weightRange}
                        </span>
                      </div>
                      {!hasAny ? (
                        <p className="text-xs italic mb-2" style={{ color: 'var(--text-muted)' }}>
                          No attempts in this domain yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {domainTopics.map((s) => {
                            const hasEnough = s.attempts >= 3;
                            const available = QUESTIONS.filter((q) => q.topicId === s.topicId).length;
                            return (
                              <div
                                key={s.topicId}
                                className="flex items-center gap-3 p-2.5 rounded-lg"
                                style={{ background: 'var(--surface-2)' }}
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>
                                      {s.topicName}
                                    </span>
                                    {!hasEnough && s.attempts > 0 && (
                                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        · needs more data
                                      </span>
                                    )}
                                    {s.attempts === 0 && (
                                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                        · not attempted
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {s.attempts} of {available} attempted · {s.correct} correct
                                  </div>
                                </div>
                                <div className="w-24 sm:w-32 shrink-0">
                                  {s.attempts > 0 ? (
                                    <ProgressBar
                                      value={s.accuracy}
                                      showLabel
                                      color={s.accuracy >= 0.6 ? 'sage' : 'orange'}
                                    />
                                  ) : (
                                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                      —
                                    </span>
                                  )}
                                </div>
                                <button
                                  className="btn btn-ghost !p-2 !min-h-0 shrink-0"
                                  style={{ width: 32, height: 32 }}
                                  onClick={() => onPractiseTopic(s.topicId)}
                                  aria-label={`Practise ${s.topicName}`}
                                  title={`Practise ${s.topicName}`}
                                >
                                  <GraduationCap size={15} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Incorrect questions review */}
          <section className="mt-8">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>
              Incorrectly answered questions ({incorrect.length})
            </h2>
            {incorrect.length === 0 ? (
              <div
                className="rounded-xl p-6 text-center"
                style={{ background: 'var(--surface-2)', border: '1px dashed var(--border-strong)' }}
              >
                <Check size={24} className="mx-auto mb-2" style={{ color: 'var(--sage)' }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  No incorrect answers yet
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-soft)' }}>
                  Every question you have answered so far has been correct.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {incorrect
                  .slice()
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((attempt) => {
                    const q = getQuestion(attempt.questionId);
                    if (!q) return null;
                    const correctOpt = q.options.find((o) => o.id === attempt.correctOptionId);
                    const selectedOpt = q.options.find((o) => o.id === attempt.selectedOptionId);
                    return (
                      <div
                        key={attempt.id}
                        className="surface p-4"
                        style={{ borderLeft: '3px solid var(--error)' }}
                      >
                        <div className="flex items-start gap-2">
                          <X size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--error)' }} />
                          <div className="flex-1">
                            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                              {q.topicName} · {q.difficulty}
                            </div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                              {q.prompt}
                            </p>
                            <p className="mt-2 text-sm" style={{ color: 'var(--text-soft)' }}>
                              <strong style={{ color: 'var(--error)' }}>Your answer:</strong>{' '}
                              {selectedOpt?.text}
                            </p>
                            <p className="mt-1 text-sm" style={{ color: 'var(--text-soft)' }}>
                              <strong style={{ color: 'var(--sage-strong)' }}>Correct answer:</strong>{' '}
                              {correctOpt?.text}
                            </p>
                            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>

          <section className="mt-8">
            <OfficialResources />
          </section>
          <section className="mt-4">
            <Disclaimer />
          </section>
        </>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Reset all progress?"
        message="This will permanently delete your practice history and all derived metrics stored in this browser. Your saved concept bookmarks and theme preference will remain. This cannot be undone."
        confirmLabel="Yes, reset progress"
        cancelLabel="Keep my progress"
        destructive
        onConfirm={() => {
          onReset();
          setConfirmReset(false);
        }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
