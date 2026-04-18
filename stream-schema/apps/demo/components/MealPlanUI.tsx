import type { DeepPartial, StreamStatus } from '../lib/stream-schema';
import type { MealPlan } from '../lib/types';
import { Skeleton } from './Skeleton';

export function MealPlanUI({
  data,
  status,
}: {
  data: DeepPartial<MealPlan>;
  status: StreamStatus;
}) {
  const items = data.items ?? [];
  const skeletonCount = Math.max(0, 4 - items.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.title ? (
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              lineHeight: 1.2,
              color: 'var(--text)',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {data.title}
          </h2>
        ) : (
          <Skeleton h={24} w="60%" />
        )}

        {data.description ? (
          <p
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              animation: 'fadeUp 0.3s ease',
            }}
          >
            {data.description}
          </p>
        ) : (
          <Skeleton h={14} />
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(data.tags ?? []).map((tag, i) => (
          <span
            key={i}
            style={{
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: 99,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(163,255,78,0.2)',
              color: 'var(--accent)',
              animation: 'fadeUp 0.25s ease',
            }}
          >
            {tag}
          </span>
        ))}
        {(data.tags?.length ?? 0) < 4 &&
          status === 'streaming' &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ width: 60 + i * 20, height: 22, borderRadius: 99 }}
            />
          ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.emoji ?? '⋯'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  marginBottom: 2,
                }}
              >
                {item.meal ?? (
                  <span
                    className="skeleton"
                    style={{ display: 'inline-block', width: 60, height: 10 }}
                  />
                )}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.name ?? <Skeleton h={14} />}
              </div>
            </div>
            {item.calories ? (
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                {item.calories} cal
              </span>
            ) : (
              <Skeleton w={50} h={12} />
            )}
          </div>
        ))}

        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={`sk-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 8,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              opacity: 1 - i * 0.2,
            }}
          >
            <div
              className="skeleton"
              style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton w="30%" h={10} />
              <Skeleton w="70%" h={14} />
            </div>
            <Skeleton w={50} h={12} />
          </div>
        ))}
      </div>

      {data.totalCalories ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--border-light)',
            animation: 'fadeUp 0.3s ease',
          }}
        >
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily total</span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              color: 'var(--accent)',
            }}
          >
            {data.totalCalories.toLocaleString()} cal
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px' }}>
          <Skeleton w="30%" h={14} />
          <Skeleton w="20%" h={18} />
        </div>
      )}
    </div>
  );
}
