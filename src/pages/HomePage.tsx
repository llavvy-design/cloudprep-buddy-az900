import { ArrowRight, BookOpen, GraduationCap, Sparkles, HelpCircle, Bookmark, Target, TrendingUp, Cloud, Compass } from 'lucide-react';
import type { PageId, Attempt } from '../types';
import { DOMAINS, TOPICS } from '../data/curriculum';
import {
  computeDomainStats,
  computeReadiness,
  recommendWeakTopic,
} from '../utils/stats';
import { StatCard, ProgressBar, EmptyState } from '../components/ui';
import { OfficialResources, Disclaimer } from '../components/OfficialResources';
import { Wordmark } from '../components/Wordmark';

interface HomePageProps {
  attempts: Attempt[];
  bookmarkCount: number;
  onNavigate: (page: PageId) => void;
  onPractiseTopic?: (topicId: string) => void;
}

export function HomePage({ attempts, bookmarkCount, onNavigate }: HomePageProps) {
  const totalAnswered = attempts.length;
  const totalCorrect = attempts.filter((a) => a.isCorrect).length;
  const accuracy = totalAnswered > 0 ? totalCorrect / totalAnswered : 0;
  const topicsPractised = new Set(attempts.map((a) => a.topicId)).size;

  const domainStats = computeDomainStats(attempts);
  const readiness = computeReadiness(attempts);
  const weak = recommendWeakTopic(attempts);

  return (
    <div className="cpb-fade-in">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8 lg:p-10"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div
          className="absolute -right-16 -top-16 rounded-full opacity-20"
          style={{ width: 260, height: 260, background: 'var(--sage)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -right-6 top-20 rounded-full opacity-10"
          style={{ width: 140, height: 140, background: 'var(--orange)' }}
          aria-hidden="true"
        />

        <div className="relative max-w-2xl">
          <div
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ background: 'var(--orange-soft)', color: 'var(--orange-strong)' }}
          >
            <Sparkles size={12} />
            Unofficial AZ-900 learning tool
          </div>

          <Wordmark size="lg" />

          <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            Welcome back. CloudPrep Buddy helps you understand cloud concepts in plain language,
            practise original questions with real explanations, and see exactly which topics you
            are ready in — and which need another look.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn btn-primary" onClick={() => onNavigate('practice')}>
              <GraduationCap size={18} />
              {totalAnswered === 0 ? 'Start practising' : 'Practise more'}
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => onNavigate('learn')}>
              <BookOpen size={18} />
              Continue learning
            </button>
          </div>

          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            Your progress is stored only in this browser. No account needed.
          </p>
        </div>
      </section>

      {/* Summary stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <StatCard
          label="Questions answered"
          value={totalAnswered}
          hint={`${totalCorrect} correct`}
          icon={<HelpCircle size={16} />}
          accent="orange"
        />
        <StatCard
          label="Practice accuracy"
          value={totalAnswered === 0 ? '—' : Math.round(accuracy * 100) + '%'}
          hint={totalAnswered === 0 ? 'Take a quiz to begin' : `${totalCorrect} of ${totalAnswered} correct`}
          icon={<Target size={16} />}
          accent="sage"
        />
        <StatCard
          label="Topics practised"
          value={topicsPractised}
          hint={`of ${TOPICS.length} topics`
          }
          icon={<Compass size={16} />}
        />
        <StatCard
          label="Saved concepts"
          value={bookmarkCount}
          hint={bookmarkCount === 0 ? 'Bookmark notes in Learn' : 'In your library'}
          icon={<Bookmark size={16} />}
        />
      </section>

      {/* Domains */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            Exam skill domains
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Weight ranges from the official study guide
          </span>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
          {DOMAINS.map((domain) => {
            const stat = domainStats.find((d) => d.domainId === domain.id);
            const attempted = stat?.attempts ?? 0;
            const correct = stat?.correct ?? 0;
            const acc = attempted > 0 ? correct / attempted : 0;
            const available = stat?.totalAvailableQuestions ?? 0;
            return (
              <button
                key={domain.id}
                className="surface card-hover p-5 text-left"
                onClick={() => onNavigate('practice')}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text)' }}>
                    {domain.name}
                  </h3>
                  <span
                    className="chip shrink-0"
                    style={{ background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }}
                  >
                    {domain.weightRange}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  {domain.description}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>{available} practice questions</span>
                    <span>{attempted > 0 ? Math.round(acc * 100) + '% accuracy' : 'Not started'}</span>
                  </div>
                  <ProgressBar value={acc} showLabel={false} color={acc >= 0.6 ? 'sage' : 'orange'} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Readiness + weak topic */}
      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} style={{ color: 'var(--sage)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Your practice readiness
            </h2>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl shrink-0"
              style={{
                width: 64,
                height: 64,
                background: readiness.hasEnoughData
                  ? readiness.label === 'Strong practice performance'
                    ? 'var(--sage-soft)'
                    : readiness.label === 'Building confidence'
                    ? 'var(--orange-soft)'
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
          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            This is only an indicator from this app. It is not an official score, a guaranteed pass,
            or a reliable prediction of your real exam result.
          </p>
        </div>

        <div className="surface p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} style={{ color: 'var(--orange)' }} />
            <h2 className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Recommended focus
            </h2>
          </div>
          {weak.reason === 'no-data' && (
            <EmptyState
              icon={<GraduationCap size={24} />}
              title="No recommendations yet"
              message="Take a few quizzes so we can suggest a topic to focus on."
              action={
                <button className="btn btn-primary" onClick={() => onNavigate('practice')}>
                  Start practising
                </button>
              }
            />
          )}
          {weak.reason !== 'no-data' && weak.topic && (
            <div>
              <p className="text-sm" style={{ color: 'var(--text-soft)' }}>
                {weak.reason === 'only-one'
                  ? 'You have practised one topic so far. Keep going to compare across topics:'
                  : 'This topic has the lowest accuracy of your practised topics:'}
              </p>
              <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {weak.topic.topicName}
                </div>
                <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {weak.topic.correct} of {weak.topic.attempts} correct ·{' '}
                  {Math.round(weak.topic.accuracy * 100)}% accuracy
                </div>
              </div>
              <button
                className="btn btn-outline w-full mt-3"
                onClick={() => onNavigate('practice')}
              >
                Practise this topic
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          {weak.reason === 'none-clearly-weaker' && (
            <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
              <p>
                No single weak topic stands out — your accuracy is fairly even across the topics you
                have practised. Keep going to broaden your coverage.
              </p>
              <button className="btn btn-outline w-full mt-3" onClick={() => onNavigate('practice')}>
                Take another quiz
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How to use */}
      <section className="mt-8 surface p-5">
        <h2 className="text-base font-bold mb-3" style={{ color: 'var(--text)' }}>
          How to use this tool
        </h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {[
            { t: 'Read a concept first', d: 'Open Learn, read the plain-language definition and the African analogy, then bookmark it.' },
            { t: 'Practise in short sets', d: 'Take 5 or 10 questions on a topic. Read every explanation — even for answers you got right.' },
            { t: 'Watch your progress', d: 'Progress turns your real attempts into topic accuracy and a readiness indicator.' },
            { t: 'Retry missed questions', d: 'After each quiz and on the Progress page, retry only the questions you got wrong.' },
          ].map((step, i) => (
            <li key={i} className="flex gap-3">
              <span
                className="flex items-center justify-center rounded-lg shrink-0 font-bold text-sm"
                style={{
                  width: 28,
                  height: 28,
                  background: 'var(--orange-soft)',
                  color: 'var(--orange-strong)',
                }}
              >
                {i + 1}
              </span>
              <div>
                <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
                  {step.t}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>
                  {step.d}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Official resources */}
      <section className="mt-8">
        <OfficialResources />
      </section>

      <section className="mt-4">
        <Disclaimer />
      </section>
    </div>
  );
}
