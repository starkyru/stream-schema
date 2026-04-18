'use client';

import { useState, useRef, useCallback } from 'react';
import { useStructuredStream, createSimulatedStream } from '../lib/stream-schema';
import { SAMPLES } from '../lib/samples';
import type { TabKey, MealPlan, Startup, Travel } from '../lib/types';
import { MealPlanUI } from './MealPlanUI';
import { StartupUI } from './StartupUI';
import { TravelUI } from './TravelUI';
import { JsonPanel } from './JsonPanel';
import { OverviewTab } from './OverviewTab';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'meal', label: 'Meal Plan' },
  { key: 'startup', label: 'Startup Profile' },
  { key: 'travel', label: 'Travel Day' },
];

export function DemoShell() {
  const [activeTab, setActiveTab] = useState<TabKey>('about');
  const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null);
  const [rawJSON, setRawJSON] = useState('');
  const [useRealAPI, setUseRealAPI] = useState(false);
  const streamKeyRef = useRef(0);

  const { data: mealData, status: mealStatus } = useStructuredStream<MealPlan>({
    stream: activeTab === 'meal' ? stream : null,
    onChunk: setRawJSON,
  });
  const { data: startupData, status: startupStatus } = useStructuredStream<Startup>({
    stream: activeTab === 'startup' ? stream : null,
    onChunk: setRawJSON,
  });
  const { data: travelData, status: travelStatus } = useStructuredStream<Travel>({
    stream: activeTab === 'travel' ? stream : null,
    onChunk: setRawJSON,
  });

  const activeStatus =
    activeTab === 'meal'
      ? mealStatus
      : activeTab === 'startup'
        ? startupStatus
        : activeTab === 'travel'
          ? travelStatus
          : 'idle';
  const isStreaming = activeStatus === 'streaming';

  const handleGenerate = useCallback(async () => {
    if (activeTab === 'about') return;
    const key = activeTab; // narrowed to StreamKey by the guard above
    setRawJSON('');
    streamKeyRef.current++;

    if (useRealAPI) {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: key }),
      });
      setStream(res.body!);
    } else {
      setStream(createSimulatedStream(SAMPLES[key], 4, 16));
    }
  }, [activeTab, useRealAPI]);

  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
    setRawJSON('');
    setStream(null);
  };

  const renderStreamUI = () => {
    switch (activeTab) {
      case 'meal':
        return <MealPlanUI data={mealData ?? {}} status={mealStatus} />;
      case 'startup':
        return <StartupUI data={startupData ?? {}} status={startupStatus} />;
      case 'travel':
        return <TravelUI data={travelData ?? {}} status={travelStatus} />;
      default:
        return null;
    }
  };

  const isDemo = activeTab !== 'about';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid var(--border)',
          paddingLeft: 24,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '12px 20px',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              outline: 'none',
              color: activeTab === tab.key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab.key ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}

        {isDemo && (
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingRight: 24,
            }}
          >
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={useRealAPI}
                onChange={(e) => setUseRealAPI(e.target.checked)}
                style={{ accentColor: 'var(--accent)' }}
              />
              use AI
            </label>

            <button
              onClick={handleGenerate}
              disabled={isStreaming}
              style={{
                padding: '7px 16px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-display)',
                cursor: isStreaming ? 'not-allowed' : 'pointer',
                background: isStreaming ? 'var(--surface-2)' : 'var(--accent)',
                color: isStreaming ? 'var(--text-muted)' : '#000',
                border: 'none',
                outline: 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {isStreaming ? 'Streaming...' : 'Generate →'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'about' ? (
        <OverviewTab />
      ) : (
        <>
          {/* Split view */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 480 }}>
            <div
              style={{
                borderRight: '1px solid var(--border)',
                background: 'var(--surface)',
                overflow: 'hidden',
              }}
            >
              <JsonPanel raw={rawJSON} status={activeStatus} />
            </div>
            <div style={{ padding: 24, overflowY: 'auto', background: 'var(--bg)' }}>
              {activeStatus === 'idle' ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ fontSize: 28, opacity: 0.3 }}>✦</div>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    press generate
                  </p>
                </div>
              ) : (
                renderStreamUI()
              )}
            </div>
          </div>

          {/* Code snippet */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: '20px 24px',
              background: 'var(--surface)',
            }}
          >
            <pre
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                overflow: 'auto',
              }}
              dangerouslySetInnerHTML={{
                __html: [
                  `<span style="color:var(--text-dim)">// That's all it takes</span>`,
                  `<span style="color:#7dd3fc">const</span> { data, status } = <span style="color:#fda4af">useStructuredStream</span>&lt;<span style="color:#86efac">${activeTab === 'meal' ? 'MealPlan' : activeTab === 'startup' ? 'Startup' : 'Travel'}</span>&gt;({ stream });`,
                ].join('\n'),
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
