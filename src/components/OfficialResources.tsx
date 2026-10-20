import { ExternalLink, BookOpen, GraduationCap } from 'lucide-react';

export function OfficialResources({ compact }: { compact?: boolean }) {
  return (
    <div className="surface p-5">
      {!compact && (
        <h3 className="text-base font-bold mb-1" style={{ color: 'var(--text)' }}>
          Official study resources
        </h3>
      )}
      {!compact && (
        <p className="text-sm mb-3" style={{ color: 'var(--text-soft)' }}>
          For authoritative, up-to-date guidance, always refer to Microsoft Learn.
        </p>
      )}
      <ul className="space-y-2">
        <li>
          <a
            href="https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--orange-strong)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <BookOpen size={16} className="shrink-0" />
            <span className="flex-1">AZ-900 official study guide</span>
            <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
          </a>
        </li>
        <li>
          <a
            href="https://learn.microsoft.com/en-us/training/paths/describe-cloud-concepts/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--orange-strong)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <GraduationCap size={16} className="shrink-0" />
            <span className="flex-1">Microsoft Learn — cloud concepts path</span>
            <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
          </a>
        </li>
      </ul>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div
      className="text-xs leading-relaxed p-4 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
    >
      <strong style={{ color: 'var(--text-soft)' }}>Disclaimer.</strong> CloudPrep Buddy is an
      independent, unofficial learning project. It is not affiliated with or endorsed by Microsoft.
      Its original practice questions are for learning and are not real exam questions. Exam
      objectives, weights, and terminology may change — always confirm with the official Microsoft
      study guide.
    </div>
  );
}
