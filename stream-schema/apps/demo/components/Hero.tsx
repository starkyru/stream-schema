export function Hero() {
  return (
    <section
      style={{
        padding: '100px 40px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 800,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          borderRadius: 99,
          border: '1px solid var(--border-light)',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginBottom: 32,
          animation: 'fadeUp 0.5s ease',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: 'var(--accent)',
            display: 'inline-block',
          }}
        />
        React · TypeScript · 0 dependencies
      </div>

      <h1
        style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          animation: 'fadeUp 0.5s ease 0.05s both',
          marginBottom: 24,
        }}
      >
        Watch your UI
        <br />
        <span style={{ color: 'var(--accent)' }}>paint itself.</span>
      </h1>

      <p
        style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          maxWidth: 520,
          animation: 'fadeUp 0.5s ease 0.1s both',
          marginBottom: 40,
        }}
      >
        stream-schema binds structured AI output to React components as tokens stream in. No
        waiting. No flickering. Your UI <em>becomes</em> the loading state.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 40,
          animation: 'fadeUp 0.5s ease 0.15s both',
          marginBottom: 16,
        }}
      >
        {[
          { value: '0', label: 'dependencies' },
          { value: '< 3kb', label: 'core gzipped' },
          { value: 'TS', label: 'native types' },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text)',
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
