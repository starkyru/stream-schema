import type { DeepPartial, StreamStatus } from '../lib/stream-schema';
import type { Startup } from '../lib/types';
import { Skeleton } from './Skeleton';

export function StartupUI({ data }: { data: DeepPartial<Startup>; status: StreamStatus }) {
  const features = (data.features ?? []) as Array<Partial<Startup['features'][0]>>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.name ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>{data.name[0]}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, animation: 'fadeUp 0.3s ease' }}>
              {data.name}
            </h2>
          </div>
        ) : (
          <Skeleton h={28} w="40%" />
        )}

        {data.tagline ? (
          <p
            style={{
              fontSize: 14,
              color: 'var(--accent)',
              fontWeight: 500,
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {data.tagline}
          </p>
        ) : (
          <Skeleton h={16} w="80%" />
        )}
      </div>

      {data.problem ? (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: 'rgba(255,90,90,0.06)',
            border: '1px solid rgba(255,90,90,0.15)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'rgba(255,90,90,0.7)',
              marginBottom: 4,
            }}
          >
            THE PROBLEM
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--text)',
              lineHeight: 1.5,
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {data.problem}
          </p>
        </div>
      ) : (
        <Skeleton h={64} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          FEATURES
        </div>
        {features.map((f, i) => (
          <div
            key={i}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>
              {f.title ?? <Skeleton h={12} w="40%" />}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {f.description ?? <Skeleton h={12} />}
            </div>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - features.length) }).map((_, i) => (
          <div
            key={`sk-${i}`}
            style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              opacity: 1 - i * 0.25,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <Skeleton h={12} w="40%" />
            <Skeleton h={12} w="80%" />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginBottom: 4,
            }}
          >
            TARGET
          </div>
          <div style={{ fontSize: 12, color: 'var(--text)' }}>
            {data.targetMarket ?? <Skeleton h={12} />}
          </div>
        </div>
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(163,255,78,0.2)',
            textAlign: 'center',
            minWidth: 100,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
              marginBottom: 4,
            }}
          >
            PRICING
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
            {data.pricing ?? <Skeleton h={12} />}
          </div>
        </div>
      </div>
    </div>
  );
}
