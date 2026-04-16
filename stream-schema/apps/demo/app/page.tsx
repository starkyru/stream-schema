'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useStructuredStream, createSimulatedStream, DeepPartial, StreamStatus } from '../lib/stream-schema';

// ---------------------------------------------------------------------------
// Demo data types
// ---------------------------------------------------------------------------
type MealPlan = {
  title: string;
  description: string;
  items: Array<{ meal: string; name: string; calories: number; emoji: string }>;
  totalCalories: number;
  tags: string[];
};

type Startup = {
  name: string;
  tagline: string;
  problem: string;
  features: Array<{ title: string; description: string }>;
  targetMarket: string;
  pricing: string;
};

type Travel = {
  destination: string;
  theme: string;
  morning: { activity: string; tip: string };
  afternoon: { activity: string; tip: string };
  evening: { activity: string; tip: string };
  tips: string[];
};

type DemoKey = 'meal' | 'startup' | 'travel';
type DemoData = MealPlan | Startup | Travel;

// ---------------------------------------------------------------------------
// Sample JSON for simulation mode
// ---------------------------------------------------------------------------
const SAMPLES: Record<DemoKey, string> = {
  meal: JSON.stringify({
    title: "Mediterranean Monday",
    description: "Light, heart-healthy meals inspired by the coastal cuisines of Greece and Southern Italy.",
    items: [
      { meal: "Breakfast", name: "Greek yogurt with thyme honey, crushed walnuts & pomegranate", calories: 340, emoji: "🫙" },
      { meal: "Lunch", name: "Grilled halloumi & roasted pepper salad with lemon vinaigrette", calories: 490, emoji: "🥗" },
      { meal: "Dinner", name: "Baked sea bass with capers, olives & cherry tomatoes", calories: 560, emoji: "🐟" },
      { meal: "Snack", name: "Hummus with warm pita, cucumber & kalamata olives", calories: 210, emoji: "🫓" }
    ],
    totalCalories: 1600,
    tags: ["Mediterranean", "Heart-healthy", "High protein", "Anti-inflammatory"]
  }, null, 2),

  startup: JSON.stringify({
    name: "Orbital",
    tagline: "The async task manager built for distributed teams",
    problem: "Remote engineering teams waste 4+ hours weekly on status meetings that could be fully async.",
    features: [
      { title: "Async standups", description: "Record a 90-second video or text update on your own schedule" },
      { title: "AI summaries", description: "Get distilled team progress each morning without reading every update" },
      { title: "Smart nudges", description: "Gentle reminders based on blocking dependencies, not arbitrary calendars" },
      { title: "Timeline view", description: "See exactly when each piece lands so nothing ships in the dark" }
    ],
    targetMarket: "Startups and scale-ups with distributed engineering teams of 10-200 people",
    pricing: "$14 per seat / month, free for teams under 5"
  }, null, 2),

  travel: JSON.stringify({
    destination: "Kyoto, Japan",
    theme: "Temples, matcha, and hidden gardens off the tourist trail",
    morning: {
      activity: "Fushimi Inari Taisha at sunrise - hike the upper torii path",
      tip: "Arrive before 6:30am. The lower gates are photographed to death; the upper mountain is almost always empty."
    },
    afternoon: {
      activity: "Arashiyama bamboo grove, then Tenryu-ji's moss garden",
      tip: "Skip the main bamboo path. Buy a garden ticket through Tenryu-ji - it leads to a quieter, better-maintained grove entrance."
    },
    evening: {
      activity: "Dinner in Pontocho alley, then Gion corner walk",
      tip: "Look for restaurants where staff are setting up by 5pm - early tables avoid the rush and get more attentive service."
    },
    tips: [
      "Get a Suica IC card at Kyoto Station - works on all buses and trains",
      "Nishiki Market is best before 9am, unbearable after noon",
      "Most temples are cash-only for entry"
    ]
  }, null, 2),
};

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Skeleton({ w, h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div
      className="skeleton"
      style={{ width: w ?? '100%', height: h, borderRadius: 4 }}
    />
  );
}

// ---------------------------------------------------------------------------
// Demo: Meal Plan UI
// ---------------------------------------------------------------------------
function MealPlanUI({ data, status }: { data: DeepPartial<MealPlan>; status: StreamStatus }) {
  const items = data.items ?? [];
  const skeletonCount = Math.max(0, 4 - items.length);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.title ? (
          <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: 'var(--text)', animation: 'fadeUp 0.3s ease' }}>
            {data.title}
          </h2>
        ) : <Skeleton h={24} w="60%" />}

        {data.description ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, animation: 'fadeUp 0.3s ease' }}>
            {data.description}
          </p>
        ) : <Skeleton h={14} />}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {(data.tags ?? []).map((tag, i) => (
          <span key={i} style={{
            fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
            padding: '3px 8px', borderRadius: 99,
            background: 'var(--accent-dim)', border: '1px solid rgba(163,255,78,0.2)',
            color: 'var(--accent)', animation: 'fadeUp 0.25s ease',
          }}>{tag}</span>
        ))}
        {(data.tags?.length ?? 0) < 4 && status === 'streaming' && (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: 60 + i * 20, height: 22, borderRadius: 99 }} />
          ))
        )}
      </div>

      {/* Meal items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            animation: 'fadeUp 0.3s ease',
          }}>
            <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{item.emoji ?? '⋯'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 2 }}>
                {item.meal ?? <span className="skeleton" style={{ display: 'inline-block', width: 60, height: 10 }} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name ?? <Skeleton h={14} />}
              </div>
            </div>
            {item.calories ? (
              <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 500, flexShrink: 0 }}>
                {item.calories} cal
              </span>
            ) : <Skeleton w={50} h={12} />}
          </div>
        ))}

        {/* Skeleton slots for pending items */}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`sk-${i}`} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px', borderRadius: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            opacity: 1 - i * 0.2,
          }}>
            <div className="skeleton" style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Skeleton w="30%" h={10} />
              <Skeleton w="70%" h={14} />
            </div>
            <Skeleton w={50} h={12} />
          </div>
        ))}
      </div>

      {/* Total */}
      {data.totalCalories ? (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 14px', borderRadius: 8,
          border: '1px solid var(--border-light)', animation: 'fadeUp 0.3s ease',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Daily total</span>
          <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
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

// ---------------------------------------------------------------------------
// Demo: Startup UI
// ---------------------------------------------------------------------------
function StartupUI({ data, status }: { data: DeepPartial<Startup>; status: StreamStatus }) {
  const features = data.features ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {data.name ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#000' }}>{data.name[0]}</span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, animation: 'fadeUp 0.3s ease' }}>{data.name}</h2>
          </div>
        ) : <Skeleton h={28} w="40%" />}

        {data.tagline ? (
          <p style={{ fontSize: 14, color: 'var(--accent)', fontWeight: 500, animation: 'fadeUp 0.3s ease' }}>
            {data.tagline}
          </p>
        ) : <Skeleton h={16} w="80%" />}
      </div>

      {data.problem ? (
        <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(255,90,90,0.06)', border: '1px solid rgba(255,90,90,0.15)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,90,90,0.7)', marginBottom: 4 }}>THE PROBLEM</div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, animation: 'fadeUp 0.3s ease' }}>{data.problem}</p>
        </div>
      ) : <Skeleton h={64} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>FEATURES</div>
        {features.map((f, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', animation: 'fadeUp 0.3s ease' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{f.title ?? <Skeleton h={12} w="40%" />}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{f.description ?? <Skeleton h={12} />}</div>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 4 - features.length) }).map((_, i) => (
          <div key={`sk-${i}`} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)', opacity: 1 - i * 0.25, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton h={12} w="40%" />
            <Skeleton h={12} w="80%" />
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4 }}>TARGET</div>
          <div style={{ fontSize: 12, color: 'var(--text)' }}>{data.targetMarket ?? <Skeleton h={12} />}</div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--accent-dim)', border: '1px solid rgba(163,255,78,0.2)', textAlign: 'center', minWidth: 100 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--accent)', marginBottom: 4 }}>PRICING</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>{data.pricing ?? <Skeleton h={12} />}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo: Travel UI
// ---------------------------------------------------------------------------
function TravelUI({ data, status }: { data: DeepPartial<Travel>; status: StreamStatus }) {
  const timeOfDay = [
    { key: 'morning' as const, label: 'Morning', emoji: '🌅' },
    { key: 'afternoon' as const, label: 'Afternoon', emoji: '☀️' },
    { key: 'evening' as const, label: 'Evening', emoji: '🌙' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        {data.destination ? (
          <h2 style={{ fontSize: 22, fontWeight: 800, animation: 'fadeUp 0.3s ease' }}>{data.destination}</h2>
        ) : <Skeleton h={26} w="50%" />}
        {data.theme ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4, fontStyle: 'italic', animation: 'fadeUp 0.3s ease' }}>
            {data.theme}
          </p>
        ) : <Skeleton h={14} w="75%" style={{ marginTop: 6 }} />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {timeOfDay.map(({ key, label, emoji }) => {
          const slot = data[key] as { activity?: string; tip?: string } | undefined;
          return (
            <div key={key} style={{ padding: '14px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', animation: slot?.activity ? 'fadeUp 0.3s ease' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{emoji}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</span>
              </div>
              {slot?.activity ? (
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{slot.activity}</div>
              ) : <Skeleton h={14} w="85%" />}
              {slot?.tip ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, paddingLeft: 10, borderLeft: '2px solid var(--border-light)' }}>
                  {slot.tip}
                </div>
              ) : <div style={{ height: 8 }} />}
            </div>
          );
        })}
      </div>

      {(data.tips ?? []).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PRACTICAL TIPS</div>
          {(data.tips ?? []).map((tip, i) => (
            <div key={i} style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 8, animation: 'fadeUp 0.3s ease' }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// JSON Panel
// ---------------------------------------------------------------------------
function JsonPanel({ raw, status }: { raw: string; status: StreamStatus }) {
  const scrollRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [raw]);

  // Very light syntax highlight - just strings and keys
  const highlighted = raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"([^"]+)":/g, '<span style="color:#7dd3fc">"$1"</span>:')
    .replace(/: "([^"]*)"/g, ': <span style="color:#86efac">"$1"</span>')
    .replace(/: (\d+)/g, ': <span style="color:#fda4af">$1</span>')
    .replace(/: (true|false|null)/g, ': <span style="color:#c4b5fd">$1</span>');

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#ff5a5a' }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#28c840' }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', flex: 1 }}>
          raw stream
        </span>
        <div style={{
          width: 6, height: 6, borderRadius: 99,
          background: status === 'streaming' ? 'var(--accent)' : status === 'complete' ? '#28c840' : 'var(--text-dim)',
          boxShadow: status === 'streaming' ? '0 0 6px var(--accent)' : 'none',
        }} />
      </div>

      {/* JSON content */}
      <pre
        ref={scrollRef}
        style={{
          flex: 1, overflow: 'auto', padding: '14px',
          fontSize: 11, lineHeight: 1.6, fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
        }}
        dangerouslySetInnerHTML={{
          __html: highlighted + (status === 'streaming' ? '<span style="animation:blink 0.9s ease infinite;display:inline-block;width:6px;height:12px;background:var(--accent);margin-left:2px;vertical-align:middle"></span>' : ''),
        }}
      />

      {/* Char count */}
      {raw.length > 0 && (
        <div style={{
          padding: '6px 14px', borderTop: '1px solid var(--border)',
          fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)',
        }}>
          {raw.length.toLocaleString()} chars
        </div>
      )}

      {/* Empty state */}
      {raw.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'center', pointerEvents: 'none', top: 40,
        }}>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
            waiting for stream...
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo Shell
// ---------------------------------------------------------------------------
const TABS: { key: DemoKey; label: string }[] = [
  { key: 'meal', label: 'Meal Plan' },
  { key: 'startup', label: 'Startup Profile' },
  { key: 'travel', label: 'Travel Day' },
];

function DemoShell() {
  const [activeDemo, setActiveDemo] = useState<DemoKey>('meal');
  const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null);
  const [rawJSON, setRawJSON] = useState('');
  const [useRealAPI, setUseRealAPI] = useState(false);
  const streamKeyRef = useRef(0);

  const { data: mealData, status: mealStatus } = useStructuredStream<MealPlan>({
    stream: activeDemo === 'meal' ? stream : null,
    onChunk: setRawJSON,
  });
  const { data: startupData, status: startupStatus } = useStructuredStream<Startup>({
    stream: activeDemo === 'startup' ? stream : null,
    onChunk: setRawJSON,
  });
  const { data: travelData, status: travelStatus } = useStructuredStream<Travel>({
    stream: activeDemo === 'travel' ? stream : null,
    onChunk: setRawJSON,
  });

  const activeStatus = activeDemo === 'meal' ? mealStatus : activeDemo === 'startup' ? startupStatus : travelStatus;
  const isStreaming = activeStatus === 'streaming';

  const handleGenerate = useCallback(async () => {
    setRawJSON('');
    streamKeyRef.current++;

    if (useRealAPI) {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo: activeDemo }),
      });
      setStream(res.body!);
    } else {
      setStream(createSimulatedStream(SAMPLES[activeDemo], 4, 16));
    }
  }, [activeDemo, useRealAPI]);

  const handleTabChange = (key: DemoKey) => {
    setActiveDemo(key);
    setRawJSON('');
    setStream(null);
  };

  const renderUI = () => {
    switch (activeDemo) {
      case 'meal':    return <MealPlanUI    data={mealData}    status={mealStatus} />;
      case 'startup': return <StartupUI     data={startupData} status={startupStatus} />;
      case 'travel':  return <TravelUI      data={travelData}  status={travelStatus} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex', gap: 0, borderBottom: '1px solid var(--border)',
        paddingLeft: 24,
      }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              padding: '12px 20px', fontSize: 13, fontWeight: 500,
              fontFamily: 'var(--font-display)', cursor: 'pointer',
              background: 'none', border: 'none', outline: 'none',
              color: activeDemo === tab.key ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeDemo === tab.key ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Generate button + mode toggle - pushed to right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, paddingRight: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', cursor: 'pointer' }}>
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
              padding: '7px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
              fontFamily: 'var(--font-display)', cursor: isStreaming ? 'not-allowed' : 'pointer',
              background: isStreaming ? 'var(--surface-2)' : 'var(--accent)',
              color: isStreaming ? 'var(--text-muted)' : '#000',
              border: 'none', outline: 'none',
              transition: 'all 0.15s ease',
              animation: isStreaming ? 'none' : undefined,
            }}
          >
            {isStreaming ? 'Streaming...' : 'Generate →'}
          </button>
        </div>
      </div>

      {/* Split view */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 480 }}>
        {/* Left: JSON stream */}
        <div style={{ borderRight: '1px solid var(--border)', background: 'var(--surface)', overflow: 'hidden' }}>
          <JsonPanel raw={rawJSON} status={activeStatus} />
        </div>

        {/* Right: Rendered UI */}
        <div style={{ padding: 24, overflowY: 'auto', background: 'var(--bg)' }}>
          {activeStatus === 'idle' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ fontSize: 28, opacity: 0.3 }}>✦</div>
              <p style={{ fontSize: 13, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                press generate
              </p>
            </div>
          ) : renderUI()}
        </div>
      </div>

      {/* Code snippet */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', background: 'var(--surface)' }}>
        <pre style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', lineHeight: 1.6, overflow: 'auto' }}
          dangerouslySetInnerHTML={{
            __html: [
              `<span style="color:var(--text-dim)">// That's all it takes</span>`,
              `<span style="color:#7dd3fc">const</span> { data, status } = <span style="color:#fda4af">useStructuredStream</span>&lt;<span style="color:#86efac">${activeDemo === 'meal' ? 'MealPlan' : activeDemo === 'startup' ? 'Startup' : 'Travel'}</span>&gt;({ stream });`,
            ].join('\n')
          }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'rgba(7,7,10,0.8)',
        backdropFilter: 'blur(12px)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>stream-schema</span>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--accent-dim)', color: 'var(--accent)', fontFamily: 'var(--font-mono)', border: '1px solid rgba(163,255,78,0.2)' }}>
            v0.1.0
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {['Docs', 'GitHub'].map((link) => (
            <a key={link} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
              {link}
            </a>
          ))}
          <a href="#install" style={{
            fontSize: 12, padding: '7px 14px', borderRadius: 7,
            background: 'var(--surface-2)', border: '1px solid var(--border-light)',
            color: 'var(--text)', textDecoration: 'none', fontWeight: 500,
          }}>
            Install
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '100px 40px 80px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
        maxWidth: 800, margin: '0 auto', width: '100%',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
          borderRadius: 99, border: '1px solid var(--border-light)',
          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)',
          marginBottom: 32, animation: 'fadeUp 0.5s ease',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--accent)', display: 'inline-block' }} />
          React · TypeScript · 0 dependencies
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em',
          animation: 'fadeUp 0.5s ease 0.05s both',
          marginBottom: 24,
        }}>
          Watch your UI<br />
          <span style={{ color: 'var(--accent)' }}>paint itself.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-muted)', lineHeight: 1.6,
          maxWidth: 520, animation: 'fadeUp 0.5s ease 0.1s both', marginBottom: 40,
        }}>
          stream-schema binds structured AI output to React components as tokens stream in.
          No waiting. No flickering. Your UI <em>becomes</em> the loading state.
        </p>

        {/* Stats */}
        <div style={{
          display: 'flex', gap: 40, animation: 'fadeUp 0.5s ease 0.15s both', marginBottom: 16,
        }}>
          {[
            { value: '0', label: 'dependencies' },
            { value: '< 3kb', label: 'core gzipped' },
            { value: 'TS', label: 'native types' },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo */}
      <section style={{ maxWidth: 1100, margin: '0 auto 80px', width: '100%', padding: '0 40px' }}>
        <div style={{
          borderRadius: 14, border: '1px solid var(--border)',
          overflow: 'hidden', background: 'var(--bg)',
          boxShadow: '0 0 80px rgba(163,255,78,0.04)',
        }}>
          <DemoShell />
        </div>
      </section>

      {/* Install */}
      <section id="install" style={{
        maxWidth: 700, margin: '0 auto 120px', width: '100%', padding: '0 40px',
        display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Get started</h2>
        <div style={{
          width: '100%', padding: '16px 20px', borderRadius: 10,
          background: 'var(--surface)', border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>
            <span style={{ color: 'var(--text-muted)' }}>$ </span>
            npm install <span style={{ color: 'var(--accent)' }}>@stream-schema/core @stream-schema/react</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>copy</span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Optional Zod integration: <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text)' }}>@stream-schema/zod</code>
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '24px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
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
