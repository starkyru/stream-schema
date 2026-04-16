# stream-schema

**Live-bind structured AI output to your React UI as it streams.**

Most AI apps stream raw text. `stream-schema` lets you stream structured JSON - and watch your UI paint itself in real time as tokens arrive.

```tsx
const { data, status } = useStructuredStream<MealPlan>({ stream });

<h1>{data.title ?? <Skeleton />}</h1>
<ul>
  {data.items?.map(item => <li>{item.name}</li>)}
</ul>
```

`data` updates on every token. `data.title` goes from `undefined` → `"Mea"` → `"Meal Pl"` → `"Meal Plan"`. Your UI follows.

---

## Why?

Every app building on top of LLMs needs this. Nobody has built it cleanly.

The problem: LLMs stream tokens, not complete objects. If you want structured output, you either wait for the full response (slow, bad UX) or you write a custom partial JSON parser for every project (fragile, repetitive).

`stream-schema` solves it once, for everyone.

---

## Install

```bash
npm install @stream-schema/core @stream-schema/react
# optional: Zod integration
npm install @stream-schema/zod
```

---

## Usage

### 1. Basic - no schema

```tsx
import { useStructuredStream } from '@stream-schema/react';

type MealPlan = {
  title: string;
  items: Array<{ name: string; calories: number }>;
};

function MealPlanView() {
  const [stream, setStream] = useState<ReadableStream | null>(null);

  const { data, status } = useStructuredStream<MealPlan>({ stream });

  const generate = async () => {
    const res = await fetch('/api/generate');
    setStream(res.body);
  };

  return (
    <div>
      <button onClick={generate}>Generate</button>
      <h1>{data.title ?? 'Loading...'}</h1>
      {data.items?.map((item, i) => (
        <div key={i}>{item.name} - {item.calories} cal</div>
      ))}
    </div>
  );
}
```

### 2. Schema-first with Zod

```tsx
import { useSchemaStream } from '@stream-schema/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  items: z.array(z.object({
    name: z.string(),
    calories: z.number(),
  })),
});

const { data, status } = useSchemaStream({
  stream,
  schema,
  validateOnComplete: true, // full Zod validation once done
});
// data is typed as DeepPartial<z.infer<typeof schema>>
```

### 3. With headless primitives

```tsx
import {
  useStructuredStream,
  StreamField,
  StreamList,
  StreamStatus,
  StreamStatusProvider,
} from '@stream-schema/react';

function MealPlanView({ stream }) {
  const { data, status } = useStructuredStream<MealPlan>({ stream });

  return (
    <StreamStatusProvider status={status}>
      <StreamField
        value={data.title}
        skeleton={<div className="skeleton h-8 w-48" />}
      >
        {(title) => <h1>{title}</h1>}
      </StreamField>

      <StreamList
        items={data.items}
        skeletonCount={4}
        skeleton={<div className="skeleton h-12 w-full" />}
      >
        {(item) => <MealCard name={item.name} calories={item.calories} />}
      </StreamList>

      <StreamStatus>
        {({ isStreaming }) => isStreaming && <p>Generating...</p>}
      </StreamStatus>
    </StreamStatusProvider>
  );
}
```

### 4. Provider adapters (OpenAI / Anthropic)

```tsx
import { openAIExtractor, anthropicExtractor } from '@stream-schema/core';

// OpenAI
const { data } = useStructuredStream<T>({
  stream: res.body,
  extractJSON: openAIExtractor,
});

// Anthropic
const { data } = useStructuredStream<T>({
  stream: res.body,
  extractJSON: anthropicExtractor,
});
```

---

## API

### `useStructuredStream<T>(options)`

| Option | Type | Description |
|---|---|---|
| `stream` | `ReadableStream \| null` | Stream to consume |
| `extractJSON` | `(chunk: string) => string` | Transform raw SSE chunks to JSON text |
| `onComplete` | `(data: DeepPartial<T>) => void` | Called when stream ends |
| `onError` | `(err: Error) => void` | Called on stream error |

Returns `{ data, status, error, reset }`.

---

### `StreamField`

Renders a skeleton while `value` is falsy, renders `value` (or `children(value)`) once available.

### `StreamList`

Renders `skeletonCount` skeleton slots while `items` is empty. Renders items as they arrive.

### `StreamStatusProvider` + `StreamStatus` + `useStreamStatus`

Propagate streaming status through context. Useful for deeply nested indicators.

---

## How it works

The core is a partial JSON parser that uses best-effort completion:

1. Try `JSON.parse` directly (handles complete JSON fast path)
2. Walk the string tracking open `{`, `[`, and string state
3. Close any open string, strip trailing commas, close open structures
4. Try `JSON.parse` on the completed string
5. If still failing, strip the last incomplete token and retry

This means `{"title": "Meal pl` becomes `{"title": "Meal pl"}` and you get `{ title: "Meal pl" }` live.

---

## Framework-agnostic core

The parser and stream reader live in `@stream-schema/core` with zero dependencies. You can use them outside React:

```ts
import { streamStructured } from '@stream-schema/core';

for await (const { partial, done } of streamStructured<MealPlan>(stream)) {
  console.log(partial.title); // updates live
}
```

---

## Packages

| Package | Description |
|---|---|
| `@stream-schema/core` | Partial JSON parser + stream reader. Zero dependencies. |
| `@stream-schema/react` | `useStructuredStream` hook + headless primitives. |
| `@stream-schema/zod` | Zod schema integration + `useSchemaStream`. |

---

## License

MIT
