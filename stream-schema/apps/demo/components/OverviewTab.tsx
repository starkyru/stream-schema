const REPO_URL = 'https://github.com/starkyru/stream-schema';

export function OverviewTab() {
  return (
    <div
      style={{
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        maxWidth: 720,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            stream-schema
          </span>
          <span
            style={{
              fontSize: 10,
              padding: '2px 7px',
              borderRadius: 4,
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(163,255,78,0.2)',
            }}
          >
            v0.1.0
          </span>
        </div>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Live-bind structured AI output to your React UI as it streams. No waiting. No flickering.
          Your UI <em style={{ color: 'var(--text)' }}>becomes</em> the loading state.
        </p>
      </div>

      {/* Repo link */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 16px',
            borderRadius: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border-light)',
            color: 'var(--text)',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 500,
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-light)')}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ flexShrink: 0 }}
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          starkyru/stream-schema
        </a>
        <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          MIT license
        </span>
      </div>

      {/* Key facts */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { value: '0', label: 'dependencies' },
          { value: '< 3kb', label: 'core gzipped' },
          { value: 'TS', label: 'native types' },
        ].map(({ value, label }) => (
          <div
            key={label}
            style={{
              flex: 1,
              padding: '14px 16px',
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          HOW IT WORKS
        </div>
        {[
          'LLMs stream tokens, not complete objects. stream-schema parses partial JSON in real time.',
          "Each token updates a deep-partial typed object. Your components re-render with what's available.",
          'Show skeletons for missing fields, render content as it arrives — zero custom parsing code.',
        ].map((point, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              fontSize: 13,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
            }}
          >
            <span
              style={{
                color: 'var(--accent)',
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              →
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      {/* Install */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
          }}
        >
          INSTALL
        </div>
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--text)',
          }}
        >
          <span style={{ color: 'var(--text-dim)' }}>$ </span>
          npm install{' '}
          <span style={{ color: 'var(--accent)' }}>@stream-schema/core @stream-schema/react</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
          Optional: <span style={{ color: 'var(--text-muted)' }}>@stream-schema/zod</span> for Zod
          schema integration
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
        See the live demos in the tabs above →
      </p>
    </div>
  );
}
