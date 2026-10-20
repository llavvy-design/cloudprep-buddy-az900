import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  Check,
  X,
  RotateCcw,
  Home,
  BookOpen,
  Info,
  Lightbulb,
  Sparkles,
  AlertCircle,
  Repeat,
  ClipboardList,
} from 'lucide-react';
import type { PageId, Question, Attempt, Difficulty } from '../types';
import { DOMAINS, TOPICS, topicsForDomain } from '../data/curriculum';
import { QUESTIONS } from '../data/questions';
import { buildQuiz, shuffle, type QuizConfig } from '../utils/quiz';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar, EmptyState } from '../components/ui';

type Phase = 'setup' | 'running' | 'results';

interface PracticePageProps {
  attempts: Attempt[];
  onAddAttempt: (attempt: Attempt) => void;
  onNavigate: (page: PageId) => void;
  preselectTopicId?: string | null;
  retryMissedSignal?: number;
}

interface SessionResult {
  question: Question;
  selectedOptionId: string;
  isCorrect: boolean;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function PracticePage({ attempts, onAddAttempt, onNavigate, preselectTopicId, retryMissedSignal = 0 }: PracticePageProps) {
  const [phase, setPhase] = useState<Phase>('setup');

  // Setup config
  const [domainId, setDomainId] = useState<string | 'all'>('all');
  const [topicId, setTopicId] = useState<string | 'all'>('all');
  const [count, setCount] = useState<number | 'all'>(10);
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');

  // Apply preselect when arriving from another page
  useEffect(() => {
    if (preselectTopicId) {
      const topic = TOPICS.find((t) => t.id === preselectTopicId);
      if (topic) {
        setDomainId(topic.domainId);
        setTopicId(topic.id);
        setPhase('setup');
      }
    }
  }, [preselectTopicId]);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [buildInfo, setBuildInfo] = useState<{ usedAvailable: boolean; availableCount: number; requestedCount: number | 'all' } | null>(null);
  const [retryMode, setRetryMode] = useState(false);

  const availableForConfig = useMemo(() => {
    let pool = QUESTIONS;
    if (domainId !== 'all') pool = pool.filter((q) => q.domainId === domainId);
    if (topicId !== 'all') pool = pool.filter((q) => q.topicId === topicId);
    if (difficulty !== 'all') pool = pool.filter((q) => q.difficulty === difficulty);
    return pool.length;
  }, [domainId, topicId, difficulty]);

  const countOptions: (number | 'all')[] = [5, 10, 20, 'all'];

  const canStart = availableForConfig > 0;

  const handleDomainChange = (value: string) => {
    setDomainId(value);
    setTopicId('all');
  };

  const startQuiz = useCallback((questionsOverride?: Question[]) => {
    let questions = questionsOverride;
    let usedAvailable = false;
    let availableCount = availableForConfig;

    if (!questions) {
      const config: QuizConfig = { domainId, topicId, count, difficulty };
      const built = buildQuiz(QUESTIONS, config);
      questions = built.questions;
      usedAvailable = built.usedAvailable;
      availableCount = built.availableCount;
    }

    if (!questions || questions.length === 0) {
      return;
    }

    const shuffled = questions.map((q) => ({
      ...q,
      options: shuffle(q.options),
    }));

    setQuizQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setChecked(false);
    setSessionResults([]);
    setBuildInfo({
      usedAvailable,
      availableCount,
      requestedCount: questionsOverride ? questionsOverride.length : count,
    });
    setRetryMode(false);
    setPhase('running');
  }, [domainId, topicId, count, difficulty, availableForConfig]);

  // Retry missed questions triggered from the Progress page
  useEffect(() => {
    if (retryMissedSignal > 0) {
      const missedQuestions = QUESTIONS.filter((q) =>
        attempts.some((a) => a.questionId === q.id && !a.isCorrect)
      );
      if (missedQuestions.length > 0) {
        startQuiz(missedQuestions);
      } else {
        setRetryMode(true);
        setPhase('results');
      }
    }
  }, [retryMissedSignal, attempts, startQuiz]);

  const currentQuestion = quizQuestions[currentIndex];

  const handleCheck = () => {
    if (!currentQuestion || !selectedOptionId || checked) return;
    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    const result: SessionResult = {
      question: currentQuestion,
      selectedOptionId,
      isCorrect,
    };
    setSessionResults((prev) => [...prev, result]);
    setChecked(true);

    const attempt: Attempt = {
      id: uid(),
      questionId: currentQuestion.id,
      domainId: currentQuestion.domainId,
      topicId: currentQuestion.topicId,
      topicName: currentQuestion.topicName,
      difficulty: currentQuestion.difficulty,
      selectedOptionId,
      correctOptionId: currentQuestion.correctOptionId,
      isCorrect,
      timestamp: Date.now(),
    };
    onAddAttempt(attempt);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= quizQuestions.length) {
      setPhase('results');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOptionId(null);
    setChecked(false);
  };

  const retryMissed = () => {
    const missed = sessionResults.filter((r) => !r.isCorrect).map((r) => r.question);
    if (missed.length === 0) {
      // Still move to a results screen that shows the empty-missed state
      setRetryMode(true);
      setPhase('results');
      return;
    }
    startQuiz(missed);
  };

  const restartSameConfig = () => {
    setPhase('setup');
    setQuizQuestions([]);
    setSessionResults([]);
    setBuildInfo(null);
  };

  // ---------- SETUP ----------
  if (phase === 'setup') {
    const availableTopics = domainId === 'all' ? TOPICS : topicsForDomain(domainId);

    return (
      <div className="cpb-fade-in">
        <PageHeader
          title="Practice"
          subtitle="Build a quiz from the official AZ-900 skill domains."
          icon={<GraduationCap size={22} />}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 surface p-5 sm:p-6">
            <div className="space-y-5">
              {/* Domain */}
              <div>
                <label className="label" htmlFor="f-domain">
                  Skill domain
                </label>
                <select
                  id="f-domain"
                  className="input"
                  value={domainId}
                  onChange={(e) => handleDomainChange(e.target.value)}
                >
                  <option value="all">All domains (mixed practice)</option>
                  {DOMAINS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.weightRange})
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div>
                <label className="label" htmlFor="f-topic">
                  Specific topic
                </label>
                <select
                  id="f-topic"
                  className="input"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                >
                  <option value="all">All topics in selected domain</option>
                  {availableTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <span className="label">Difficulty</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'foundation', 'intermediate'] as const).map((d) => (
                    <button
                      key={d}
                      className="btn btn-outline"
                      style={
                        difficulty === d
                          ? { background: 'var(--sage-soft)', borderColor: 'var(--sage)', color: 'var(--text)' }
                          : undefined
                      }
                      onClick={() => setDifficulty(d)}
                    >
                      {d === 'all' ? 'All levels' : d === 'foundation' ? 'Foundation' : 'Intermediate'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Count */}
              <div>
                <span className="label">Number of questions</span>
                <div className="grid grid-cols-4 gap-2">
                  {countOptions.map((c) => {
                    const disabled = typeof c === 'number' && c > availableForConfig && availableForConfig > 0;
                    const label =
                      c === 'all' ? 'All available' : `${c} questions`;
                    return (
                      <button
                        key={String(c)}
                        className="btn btn-outline"
                        disabled={availableForConfig === 0}
                        style={
                          count === c
                            ? { background: 'var(--sage-soft)', borderColor: 'var(--sage)', color: 'var(--text)' }
                            : undefined
                        }
                        onClick={() => setCount(c)}
                        title={disabled ? `Only ${availableForConfig} available` : undefined}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="btn btn-primary"
                disabled={!canStart}
                onClick={() => startQuiz()}
              >
                <GraduationCap size={18} />
                Start quiz
                <ArrowRight size={16} />
              </button>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {availableForConfig === 0
                  ? 'No questions match this combination — try a wider filter.'
                  : `${availableForConfig} question${availableForConfig === 1 ? '' : 's'} available for this combination`}
              </span>
            </div>
          </div>

          {/* Tips sidebar */}
          <div className="space-y-4">
            <div className="surface p-5">
              <div className="flex items-center gap-2 mb-2">
                <Info size={16} style={{ color: 'var(--sage)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  How quizzes work
                </h3>
              </div>
              <ul className="text-xs space-y-2" style={{ color: 'var(--text-soft)' }}>
                <li>Questions and answer order are shuffled each time.</li>
                <li>You submit an answer, then see the explanation, analogy, and memory tip.</li>
                <li>Your score is recorded only when you submit — not by clicking around.</li>
                <li>If you ask for more questions than exist, we use what is available.</li>
              </ul>
            </div>

            <div className="surface p-5">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList size={16} style={{ color: 'var(--orange)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                  Your history
                </h3>
              </div>
              <div className="text-sm" style={{ color: 'var(--text-soft)' }}>
                {attempts.length === 0 ? (
                  'No attempts yet. Your first quiz will appear here once you start.'
                ) : (
                  <>
                    You have answered <strong style={{ color: 'var(--text)' }}>{attempts.length}</strong>{' '}
                    question{attempts.length === 1 ? '' : 's'} so far.{' '}
                    <button
                      className="font-semibold underline"
                      style={{ color: 'var(--orange-strong)' }}
                      onClick={() => onNavigate('progress')}
                    >
                      See progress
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- RUNNING ----------
  if (phase === 'running' && currentQuestion) {
    const progressValue = (currentIndex + (checked ? 1 : 0)) / quizQuestions.length;
    const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    const correctOption = currentQuestion.options.find((o) => o.id === currentQuestion.correctOptionId);

    return (
      <div className="cpb-fade-in max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            className="btn btn-ghost !min-h-0 !py-2 text-sm"
            onClick={restartSameConfig}
          >
            <ChevronLeft size={16} />
            Exit quiz
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
            Question {currentIndex + 1} of {quizQuestions.length}
          </span>
        </div>

        <ProgressBar value={progressValue} max={1} />

        {buildInfo?.usedAvailable && !retryMode && currentIndex === 0 && (
          <div
            className="mt-4 flex items-start gap-2 p-3 rounded-lg text-sm"
            style={{ background: 'var(--orange-soft)', color: 'var(--orange-strong)' }}
          >
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              You asked for{' '}
              {buildInfo.requestedCount === 'all'
                ? 'all available questions'
                : `${buildInfo.requestedCount} questions`}
              , but only {buildInfo.availableCount} match your filters. We will use all{' '}
              {buildInfo.availableCount}.
            </span>
          </div>
        )}

        <div className="surface mt-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="chip" style={{ background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }}>
              {currentQuestion.topicName}
            </span>
            <span
              className="chip"
              style={{
                background: currentQuestion.difficulty === 'foundation' ? 'var(--surface-2)' : 'var(--orange-soft)',
                color: currentQuestion.difficulty === 'foundation' ? 'var(--text-soft)' : 'var(--orange-strong)',
                borderColor: 'transparent',
              }}
            >
              {currentQuestion.difficulty === 'foundation' ? 'Foundation' : 'Intermediate'}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
            {currentQuestion.prompt}
          </h2>

          <div className="mt-5 space-y-2.5">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === currentQuestion.correctOptionId;
              const showCorrect = checked && isCorrectOption;
              const showIncorrect = checked && isSelected && !isCorrectOption;

              let border = 'var(--border-strong)';
              let bg = 'var(--surface)';
              if (isSelected && !checked) {
                border = 'var(--orange)';
                bg = 'var(--orange-soft)';
              }
              if (showCorrect) {
                border = 'var(--sage)';
                bg = 'var(--sage-soft)';
              }
              if (showIncorrect) {
                border = 'var(--error)';
                bg = 'var(--orange-soft)';
              }

              return (
                <button
                  key={option.id}
                  className="w-full text-left p-3.5 rounded-xl flex items-start gap-3 transition-colors"
                  style={{ border: `1.5px solid ${border}`, background: bg }}
                  disabled={checked}
                  onClick={() => setSelectedOptionId(option.id)}
                  aria-pressed={isSelected}
                >
                  <span
                    className="flex items-center justify-center rounded-md shrink-0 font-bold text-sm"
                    style={{
                      width: 26,
                      height: 26,
                      background: isSelected && !checked ? 'var(--orange)' : showCorrect ? 'var(--sage)' : showIncorrect ? 'var(--error)' : 'var(--surface-2)',
                      color: isSelected || showCorrect || showIncorrect ? '#1A211C' : 'var(--text-soft)',
                    }}
                  >
                    {showCorrect ? (
                      <Check size={15} />
                    ) : showIncorrect ? (
                      <X size={15} />
                    ) : (
                      option.id.toUpperCase()
                    )}
                  </span>
                  <span className="text-sm sm:text-base flex-1" style={{ color: 'var(--text)' }}>
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Check / Next actions */}
          <div className="mt-5 flex flex-wrap gap-3">
            {!checked ? (
              <button
                className="btn btn-primary"
                disabled={!selectedOptionId}
                onClick={handleCheck}
              >
                <Check size={18} />
                Check answer
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleNext}>
                {currentIndex + 1 >= quizQuestions.length ? 'See results' : 'Next question'}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Explanation */}
        {checked && (
          <div className="cpb-fade-in mt-4 space-y-4">
            <div
              className="rounded-xl p-4"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${selectedOption?.id === currentQuestion.correctOptionId ? 'var(--sage)' : 'var(--error)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {selectedOption?.id === currentQuestion.correctOptionId ? (
                  <Check size={18} style={{ color: 'var(--sage-strong)' }} />
                ) : (
                  <X size={18} style={{ color: 'var(--error)' }} />
                )}
                <span
                  className="font-bold text-sm"
                  style={{
                    color: selectedOption?.id === currentQuestion.correctOptionId ? 'var(--sage-strong)' : 'var(--error)',
                  }}
                >
                  {selectedOption?.id === currentQuestion.correctOptionId ? 'Correct!' : 'Not quite.'}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
                {currentQuestion.explanation}
              </p>
              {selectedOption && selectedOption.id !== currentQuestion.correctOptionId && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  <strong style={{ color: 'var(--text)' }}>Why your choice was not the best:</strong>{' '}
                  {selectedOption.feedback}
                </p>
              )}
              {correctOption && (
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  <strong style={{ color: 'var(--sage-strong)' }}>Correct answer:</strong>{' '}
                  {correctOption.text}
                </p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles size={15} style={{ color: 'var(--orange)' }} />
                  <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    African real-world analogy
                  </h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  {currentQuestion.analogy}
                </p>
              </div>
              <div className="surface p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb size={15} style={{ color: 'var(--sage)' }} />
                  <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                    Memory tip
                  </h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                  {currentQuestion.memoryTip}
                </p>
              </div>
            </div>

            <div className="surface p-4">
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>
                Why each option is right or wrong
              </h4>
              <ul className="space-y-2">
                {currentQuestion.options.map((opt) => (
                  <li key={opt.id} className="text-sm flex gap-2">
                    <span
                      className="shrink-0 font-bold"
                      style={{ color: opt.id === currentQuestion.correctOptionId ? 'var(--sage-strong)' : 'var(--text-muted)' }}
                    >
                      {opt.id.toUpperCase()}.
                    </span>
                    <span style={{ color: 'var(--text-soft)' }}>
                      <span style={{ color: 'var(--text)' }}>{opt.text}</span>{' '}
                      {opt.id === currentQuestion.correctOptionId ? '— ' + opt.feedback : '— ' + opt.feedback}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ---------- RESULTS ----------
  if (phase === 'results') {
    const correctCount = sessionResults.filter((r) => r.isCorrect).length;
    const total = sessionResults.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const missed = sessionResults.filter((r) => !r.isCorrect);
    const topicsToRevise = Array.from(new Set(missed.map((r) => r.question.topicName)));

    return (
      <div className="cpb-fade-in max-w-3xl mx-auto">
        <PageHeader
          title="Quiz complete"
          subtitle={retryMode ? 'No missed questions to retry from this session.' : 'Here is how you did in this session.'}
          icon={<GraduationCap size={22} />}
        />

        {retryMode ? (
          <EmptyState
            icon={<Repeat size={24} />}
            title="Nothing to retry"
            message="You answered every question in this session correctly. Try a new quiz to keep practising."
            action={
              <div className="flex flex-wrap gap-2 justify-center">
                <button className="btn btn-primary" onClick={restartSameConfig}>
                  <GraduationCap size={18} />
                  Start another quiz
                </button>
                <button className="btn btn-outline" onClick={() => onNavigate('home')}>
                  <Home size={16} />
                  Back home
                </button>
              </div>
            }
          />
        ) : (
          <>
            <div className="surface p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div
                  className="flex flex-col items-center justify-center rounded-2xl shrink-0"
                  style={{
                    width: 120,
                    height: 120,
                    background: pct >= 80 ? 'var(--sage-soft)' : pct >= 60 ? 'var(--orange-soft)' : 'var(--orange-soft)',
                    color: pct >= 80 ? 'var(--sage-strong)' : 'var(--orange-strong)',
                  }}
                >
                  <span className="text-3xl font-extrabold">{pct}%</span>
                  <span className="text-xs font-semibold mt-1">score</span>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                        Correct
                      </div>
                      <div className="text-xl font-extrabold" style={{ color: 'var(--sage-strong)' }}>
                        {correctCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                        Answered
                      </div>
                      <div className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>
                        {total}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)' }}>
                        Missed
                      </div>
                      <div className="text-xl font-extrabold" style={{ color: 'var(--error)' }}>
                        {missed.length}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm" style={{ color: 'var(--text-soft)' }}>
                    {pct >= 80
                      ? 'Strong work. Keep this consistency across topics.'
                      : pct >= 60
                      ? 'Good progress — review the missed explanations and try again.'
                      : 'Do not worry. Read the explanations below and retry the missed questions.'}
                  </p>
                </div>
              </div>

              <div
                className="mt-5 flex items-start gap-2 p-3 rounded-lg text-xs"
                style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>
                  This score is from this app only. It is not an official exam score or a prediction
                  of your real exam result.
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {missed.length > 0 && (
                <button className="btn btn-primary" onClick={retryMissed}>
                  <RotateCcw size={16} />
                  Retry missed ({missed.length})
                </button>
              )}
              <button className="btn btn-outline" onClick={restartSameConfig}>
                <GraduationCap size={16} />
                Start another quiz
              </button>
              <button className="btn btn-outline" onClick={() => onNavigate('learn')}>
                <BookOpen size={16} />
                Review concepts
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate('home')}>
                <Home size={16} />
                Home
              </button>
            </div>

            {topicsToRevise.length > 0 && (
              <div className="surface p-5 mt-5">
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Topics to revise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topicsToRevise.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Review explanations */}
            <div className="mt-5">
              <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text)' }}>
                Review explanations
              </h3>
              <div className="space-y-3">
                {sessionResults.map((r, i) => {
                  const q = r.question;
                  const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
                  const selectedOpt = q.options.find((o) => o.id === r.selectedOptionId);
                  return (
                    <div
                      key={q.id}
                      className="surface p-4"
                      style={{ borderLeft: `3px solid ${r.isCorrect ? 'var(--sage)' : 'var(--error)'}` }}
                    >
                      <div className="flex items-start gap-2">
                        {r.isCorrect ? (
                          <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--sage-strong)' }} />
                        ) : (
                          <X size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--error)' }} />
                        )}
                        <div className="flex-1">
                          <div className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                            Question {i + 1} · {q.topicName}
                          </div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                            {q.prompt}
                          </p>
                          {!r.isCorrect && (
                            <p className="mt-2 text-sm" style={{ color: 'var(--text-soft)' }}>
                              <strong style={{ color: 'var(--error)' }}>Your answer:</strong>{' '}
                              {selectedOpt?.text}
                            </p>
                          )}
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
            </div>
          </>
        )}
      </div>
    );
  }

  // Fallback (should not happen)
  return null;
}
