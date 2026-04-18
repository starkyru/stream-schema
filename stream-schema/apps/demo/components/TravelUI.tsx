import type { DeepPartial, StreamStatus } from '../lib/stream-schema';
import type { Travel } from '../lib/types';
import { Skeleton } from './Skeleton';

export function TravelUI({ data }: { data: DeepPartial<Travel>; status: StreamStatus }) {
  const timeOfDay = [
    { key: 'morning' as const, label: 'Morning', emoji: '🌅' },
    { key: 'afternoon' as const, label: 'Afternoon', emoji: '☀️' },
    { key: 'evening' as const, label: 'Evening', emoji: '🌙' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        {data.destination ? (
          <h2 style={{ fontSize: 22, fontWeight: 800, animation: 'fadeUp 0.3s ease' }}>
            {data.destination}
          </h2>
        ) : (
          <Skeleton h={26} w="50%" />
        )}
        {data.theme ? (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginTop: 4,
              fontStyle: 'italic',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {data.theme}
          </p>
        ) : (
          <Skeleton h={14} w="75%" />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {timeOfDay.map(({ key, label, emoji }) => {
          const slot = data[key];
          return (
            <div
              key={key}
              style={{
                padding: '14px',
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                animation: slot?.activity ? 'fadeUp 0.3s ease' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{emoji}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                  }}
                >
                  {label}
                </span>
              </div>
              {slot?.activity ? (
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}
                >
                  {slot.activity}
                </div>
              ) : (
                <Skeleton h={14} w="85%" />
              )}
              {slot?.tip ? (
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    lineHeight: 1.4,
                    paddingLeft: 10,
                    borderLeft: '2px solid var(--border-light)',
                  }}
                >
                  {slot.tip}
                </div>
              ) : (
                <div style={{ height: 8 }} />
              )}
            </div>
          );
        })}
      </div>

      {(data.tips ?? []).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            PRACTICAL TIPS
          </div>
          {(data.tips ?? []).map((tip, i) => (
            <div
              key={i}
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                display: 'flex',
                gap: 8,
                animation: 'fadeUp 0.3s ease',
              }}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
