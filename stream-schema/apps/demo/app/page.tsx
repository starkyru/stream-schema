import { Nav } from '../components/Nav';
import { Hero } from '../components/Hero';
import { DemoShell } from '../components/DemoShell';

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Nav />

      <Hero />

      {/* Demo */}
      <section style={{ maxWidth: 1100, margin: '0 auto 80px', width: '100%', padding: '0 40px' }}>
        <div
          style={{
            borderRadius: 14,
            border: '1px solid var(--border)',
            overflow: 'hidden',
            background: 'var(--bg)',
            boxShadow: '0 0 80px rgba(163,255,78,0.04)',
          }}
        >
          <DemoShell />
        </div>
      </section>

      {/* Install */}
      <section
        id="install"
        style={{
          maxWidth: 700,
          margin: '0 auto 120px',
          width: '100%',
          padding: '0 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Get started</h2>
        <div
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: 10,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            <span style={{ color: 'var(--text-muted)' }}>$ </span>
            npm install{' '}
            <span style={{ color: 'var(--accent)' }}>@stream-schema/core @stream-schema/react</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>copy</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Optional Zod integration:{' '}
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>
            @stream-schema/zod
          </code>
        </p>
      </section>

      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '24px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
          stream-schema — MIT
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
          Built for the AI + React intersection
        </span>
      </footer>
    </main>
  );
}
