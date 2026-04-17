'use client';

const REPO_URL = 'https://github.com/starkyru/stream-schema';

export function Nav() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 40px',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        background: 'rgba(7,7,10,0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>
          stream-schema
        </span>
        <span
          style={{
            fontSize: 10,
            padding: '2px 6px',
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
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 13,
            color: 'var(--text-muted)',
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          GitHub
        </a>
        <a
          href="#install"
          style={{
            fontSize: 12,
            padding: '7px 14px',
            borderRadius: 7,
            background: 'var(--surface-2)',
            border: '1px solid var(--border-light)',
            color: 'var(--text)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          Install
        </a>
      </div>
    </nav>
  );
}
