import { useMemo, useState } from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  BookmarkCheck,
  X,
  Sparkles,
  Lightbulb,
  GraduationCap,
  Compass,
  Info,
} from 'lucide-react';
import type { PageId, ConceptEntry, DomainId } from '../types';
import { DOMAINS } from '../data/curriculum';
import { CONCEPTS } from '../data/concepts';
import { TOPICS } from '../data/curriculum';
import { PageHeader } from '../components/PageHeader';
import { Drawer } from '../components/Drawer';
import { EmptyState } from '../components/ui';
import { OfficialResources, Disclaimer } from '../components/OfficialResources';

interface LearnPageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (conceptId: string) => void;
  isBookmarked: (conceptId: string) => boolean;
  onNavigate: (page: PageId) => void;
}

export function LearnPage({ bookmarkedIds, onToggleBookmark, isBookmarked, onNavigate }: LearnPageProps) {
  const [query, setQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<DomainId | 'all'>('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [coachTopicId, setCoachTopicId] = useState<string>(TOPICS[0].id);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = CONCEPTS.slice();
    if (domainFilter !== 'all') list = list.filter((c) => c.domainId === domainFilter);
    if (savedOnly) list = list.filter((c) => bookmarkedIds.includes(c.id));
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.definition.toLowerCase().includes(q) ||
          c.explanation.toLowerCase().includes(q) ||
          c.topicName.toLowerCase().includes(q) ||
          c.analogy.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, domainFilter, savedOnly, bookmarkedIds]);

  const selected = selectedId ? CONCEPTS.find((c) => c.id === selectedId) ?? null : null;

  const coachConcepts = useMemo(
    () => CONCEPTS.filter((c) => c.topicId === coachTopicId),
    [coachTopicId]
  );

  const hasActiveFilters = query.trim() !== '' || domainFilter !== 'all' || savedOnly;

  const clearFilters = () => {
    setQuery('');
    setDomainFilter('all');
    setSavedOnly(false);
  };

  return (
    <div className="cpb-fade-in">
      <PageHeader
        title="Learn"
        subtitle="Plain-language AZ-900 concepts with African analogies and exam tips."
        icon={<BookOpen size={22} />}
        actions={
          <button
            className="btn btn-outline"
            onClick={() => onNavigate('practice')}
          >
            <GraduationCap size={16} />
            Practise these
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Library */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + filters */}
          <div className="surface p-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="search"
                className="input pl-9"
                placeholder="Search concepts, definitions, analogies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search concepts"
              />
              {query && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn-ghost btn !p-1.5 !min-h-0"
                  style={{ width: 28, height: 28 }}
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                <button
                  className="chip"
                  style={
                    domainFilter === 'all'
                      ? { background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }
                      : { cursor: 'pointer' }
                  }
                  onClick={() => setDomainFilter('all')}
                >
                  All domains
                </button>
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    className="chip"
                    style={
                      domainFilter === d.id
                        ? { background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }
                        : { cursor: 'pointer' }
                    }
                    onClick={() => setDomainFilter(d.id)}
                  >
                    {d.shortName}
                  </button>
                ))}
              </div>
              <button
                className="chip"
                style={
                  savedOnly
                    ? { background: 'var(--orange-soft)', color: 'var(--orange-strong)', borderColor: 'transparent' }
                    : { cursor: 'pointer' }
                }
                onClick={() => setSavedOnly((v) => !v)}
                aria-pressed={savedOnly}
              >
                {savedOnly ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                Saved only ({bookmarkedIds.length})
              </button>
              {hasActiveFilters && (
                <button
                  className="chip"
                  style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
                  onClick={clearFilters}
                >
                  <X size={12} />
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          {filtered.length === 0 ? (
            <EmptyState
              icon={<Search size={24} />}
              title={savedOnly ? 'No saved concepts yet' : 'No concepts match your search'}
              message={
                savedOnly
                  ? 'Bookmark concepts by tapping the bookmark icon on any card. They will appear here.'
                  : 'Try a different keyword, switch to all domains, or clear your filters.'
              }
              action={
                hasActiveFilters ? (
                  <button className="btn btn-outline" onClick={clearFilters}>
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((concept) => {
                const saved = isBookmarked(concept.id);
                const domain = DOMAINS.find((d) => d.id === concept.domainId);
                return (
                  <div
                    key={concept.id}
                    role="button"
                    tabIndex={0}
                    className="surface card-hover p-4 text-left flex flex-col cursor-pointer"
                    onClick={() => setSelectedId(concept.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(concept.id);
                      }
                    }}
                    aria-label={`Open details for ${concept.title}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="chip"
                        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', borderColor: 'transparent' }}
                      >
                        {domain?.shortName}
                      </span>
                      <button
                        type="button"
                        className="shrink-0 flex items-center justify-center rounded-md transition-colors"
                        style={{
                          width: 28,
                          height: 28,
                          color: saved ? 'var(--orange-strong)' : 'var(--text-muted)',
                          background: saved ? 'var(--orange-soft)' : 'transparent',
                          border: 'none',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(concept.id);
                        }}
                        aria-label={saved ? 'Remove bookmark' : 'Save concept'}
                        aria-pressed={saved}
                      >
                        {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </button>
                    </div>
                    <h3 className="mt-2 font-bold text-sm leading-snug" style={{ color: 'var(--text)' }}>
                      {concept.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--text-soft)' }}>
                      {concept.definition}
                    </p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--orange-strong)' }}>
                      <Compass size={12} />
                      {concept.topicName}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Concept Coach */}
        <div className="space-y-4">
          <div className="surface p-5 sticky top-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: 'var(--orange)' }} />
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                Concept Coach
              </h2>
            </div>
            <p className="text-xs mb-3" style={{ color: 'var(--text-soft)' }}>
              Pick a topic to see a curated, offline-friendly explanation with an African analogy
              and exam tip.
            </p>

            <label className="label" htmlFor="coach-topic">
              Choose a topic
            </label>
            <select
              id="coach-topic"
              className="input"
              value={coachTopicId}
              onChange={(e) => setCoachTopicId(e.target.value)}
            >
              {DOMAINS.map((d) => (
                <optgroup key={d.id} label={d.shortName}>
                  {TOPICS.filter((t) => t.domainId === d.id).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className="mt-4 space-y-3">
              {coachConcepts.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No prepared explainer for this topic yet. Try another from the list.
                </p>
              ) : (
                coachConcepts.map((c) => (
                  <div key={c.id} className="rounded-lg p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        {c.title}
                      </h3>
                      <button
                        className="shrink-0"
                        style={{ color: isBookmarked(c.id) ? 'var(--orange-strong)' : 'var(--text-muted)' }}
                        onClick={() => onToggleBookmark(c.id)}
                        aria-label={isBookmarked(c.id) ? 'Remove bookmark' : 'Save concept'}
                      >
                        {isBookmarked(c.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                      {c.explanation}
                    </p>
                    <div className="mt-3 flex items-start gap-2">
                      <Sparkles size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--orange)' }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                        <strong style={{ color: 'var(--text)' }}>Analogy. </strong>
                        {c.analogy}
                      </p>
                    </div>
                    <div className="mt-2 flex items-start gap-2">
                      <Lightbulb size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--sage)' }} />
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                        <strong style={{ color: 'var(--text)' }}>Exam tip. </strong>
                        {c.examTip}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-3 text-xs font-semibold flex items-center gap-1"
                      style={{ color: 'var(--orange-strong)' }}
                      onClick={() => setSelectedId(c.id)}
                    >
                      Read full concept
                    </button>
                  </div>
                ))
              )}
            </div>

            <div
              className="mt-4 flex items-start gap-2 p-2.5 rounded-lg text-xs"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>
                Analogies are teaching aids, not official Microsoft definitions. Always confirm
                terminology with Microsoft Learn.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <OfficialResources />
      </div>
      <div className="mt-4">
        <Disclaimer />
      </div>

      {/* Concept detail drawer */}
      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.title}
        width={600}
        resetKey={selectedId}
      >
        {selected && (
          <ConceptDetail
            concept={selected}
            saved={isBookmarked(selected.id)}
            onToggleBookmark={() => onToggleBookmark(selected.id)}
          />
        )}
      </Drawer>
    </div>
  );
}

function ConceptDetail({
  concept,
  saved,
  onToggleBookmark,
}: {
  concept: ConceptEntry;
  saved: boolean;
  onToggleBookmark: () => void;
}) {
  const domain = DOMAINS.find((d) => d.id === concept.domainId);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="chip" style={{ background: 'var(--sage-soft)', color: 'var(--sage-strong)', borderColor: 'transparent' }}>
            {domain?.shortName}
          </span>
          <span className="chip">{concept.topicName}</span>
        </div>
        <button
          className="btn btn-outline !py-2"
          onClick={onToggleBookmark}
          aria-pressed={saved}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
          Definition
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {concept.definition}
        </p>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
          Plain-language explanation
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
          {concept.explanation}
        </p>
      </section>

      <section className="rounded-lg p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles size={15} style={{ color: 'var(--orange)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            African real-world analogy
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
          {concept.analogy}
        </p>
        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          This analogy is a teaching aid, not an official definition.
        </p>
      </section>

      {concept.confusedWith && (
        <section className="rounded-lg p-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-bold mb-1.5" style={{ color: 'var(--text)' }}>
            Often confused with: {concept.confusedWith.name}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
            {concept.confusedWith.distinction}
          </p>
        </section>
      )}

      <section className="rounded-lg p-4" style={{ background: 'var(--sage-soft)', border: '1px solid transparent' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Lightbulb size={15} style={{ color: 'var(--sage-strong)' }} />
          <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
            Exam tip
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          {concept.examTip}
        </p>
      </section>
    </div>
  );
}
