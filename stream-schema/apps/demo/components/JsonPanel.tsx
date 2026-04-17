'use client';

import { useEffect, useRef } from 'react';
import type { StreamStatus } from '../lib/stream-schema';

export function JsonPanel({ raw, status }: { raw: string; status: StreamStatus }) {
  const scrollRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [raw]);

  const highlighted = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span style="color:#7dd3fc">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span style="color:#86efac">"$1"</span>')
    .replace(/: (\d+)/g, ': <span style="color:#fda4af">$1</span>')
    .replace(/: (true|false|null)/g, ': <span style="color:#c4b5fd">$1</span>');

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#ff5a5a' }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#28c840' }} />
        </div>
        <span
          style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            flex: 1,
          }}
        >
          raw stream
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background:
              status === 'streaming'
                ? 'var(--accent)'
                : status === 'complete'
                  ? '#28c840'
                  : 'var(--text-dim)',
            boxShadow: status === 'streaming' ? '0 0 6px var(--accent)' : 'none',
          }}
        />
      </div>

      <pre
        ref={scrollRef}
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '14px',
          fontSize: 11,
          lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
        dangerouslySetInnerHTML={{
          __html:
            highlighted +
            (status === 'streaming'
              ? '<span style="animation:blink 0.9s ease infinite;display:inline-block;width:6px;height:12px;background:var(--accent);margin-left:2px;vertical-align:middle"></span>'
              : ''),
        }}
      />

      {raw.length > 0 && (
        <div
          style={{
            padding: '6px 14px',
            borderTop: '1px solid var(--border)',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
          }}
        >
          {raw.length.toLocaleString()} chars
        </div>
      )}

      {raw.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            top: 40,
          }}
        >
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            waiting for stream...
          </span>
        </div>
      )}
    </div>
  );
}
