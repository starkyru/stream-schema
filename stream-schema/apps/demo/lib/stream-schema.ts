/**
 * Inlined @stream-schema/core + @stream-schema/react
 * In production: npm install @stream-schema/react
 */
import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type DeepPartial<T> =
  T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T | undefined;

export type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

// ---------------------------------------------------------------------------
// Partial JSON parser
// ---------------------------------------------------------------------------
export function parsePartialJSON(partial: string): unknown {
  const trimmed = partial.trim();
  if (!trimmed) return undefined;

  try {
    return JSON.parse(trimmed);
  } catch {
    /* continue */
  }

  return attemptCompletion(trimmed);
}

function attemptCompletion(str: string): unknown {
  const closers: Array<'}' | ']'> = [];
  let inString = false;
  let escaped = false;
  let i = 0;

  while (i < str.length) {
    const ch = str[i];
    if (escaped) {
      escaped = false;
      i++;
      continue;
    }
    if (ch === '\\' && inString) {
      escaped = true;
      i++;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      i++;
      continue;
    }
    if (inString) {
      i++;
      continue;
    }
    if (ch === '{') closers.push('}');
    else if (ch === '[') closers.push(']');
    else if (ch === '}' || ch === ']') closers.pop();
    i++;
  }

  let completed = str;
  if (inString) completed += '"';
  completed = completed.replace(/,\s*$/, '');
  completed += closers.reverse().join('');

  try {
    return JSON.parse(completed);
  } catch {
    const lastStructural = Math.max(
      completed.lastIndexOf(','),
      completed.lastIndexOf(':'),
      completed.lastIndexOf('{'),
      completed.lastIndexOf('[')
    );
    if (lastStructural <= 0) return undefined;
    return attemptCompletion(completed.slice(0, lastStructural));
  }
}

// ---------------------------------------------------------------------------
// Stream reader
// ---------------------------------------------------------------------------
async function* readRawStream(
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      if (signal?.aborted) break;
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export interface StreamReaderOptions {
  extractJSON?: (chunk: string) => string;
}

/** Single intentional runtime-to-type boundary. JSON structure must match T by caller contract. */
function asPartial<T>(value: unknown): DeepPartial<T> {
  return value as DeepPartial<T>;
}

async function* streamStructured<T>(
  stream: ReadableStream<Uint8Array>,
  options: StreamReaderOptions & { signal?: AbortSignal } = {}
): AsyncGenerator<{ partial: DeepPartial<T>; done: boolean; raw: string }> {
  const { extractJSON, signal } = options;
  let accumulated = '';

  for await (const rawChunk of readRawStream(stream, signal)) {
    const text = extractJSON ? extractJSON(rawChunk) : rawChunk;
    if (!text) continue;
    accumulated += text;
    const parsed = parsePartialJSON(accumulated);
    if (parsed !== undefined) {
      yield { partial: asPartial<T>(parsed), done: false, raw: accumulated };
    }
  }

  const finalParsed = parsePartialJSON(accumulated);
  yield { partial: asPartial<T>(finalParsed ?? {}), done: true, raw: accumulated };
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------
export interface UseStructuredStreamOptions<T> extends StreamReaderOptions {
  stream: ReadableStream<Uint8Array> | null | undefined;
  onComplete?: (data: DeepPartial<T>) => void;
  onError?: (error: Error) => void;
  onChunk?: (raw: string) => void;
}

export interface UseStructuredStreamResult<T> {
  data: DeepPartial<T> | undefined;
  status: StreamStatus;
  error: Error | null;
  reset: () => void;
}

export function useStructuredStream<T>({
  stream,
  onComplete,
  onError,
  onChunk,
  extractJSON,
}: UseStructuredStreamOptions<T>): UseStructuredStreamResult<T> {
  const [data, setData] = useState<DeepPartial<T> | undefined>(undefined);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  const onChunkRef = useRef(onChunk);
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;
  onChunkRef.current = onChunk;

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setData(undefined);
    setStatus('idle');
    setError(null);
  }, []);

  useEffect(() => {
    if (!stream) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('streaming');
    setError(null);
    setData(undefined);

    (async () => {
      try {
        for await (const { partial, done, raw } of streamStructured<T>(stream, {
          extractJSON,
          signal: controller.signal,
        })) {
          if (controller.signal.aborted) return;
          setData(partial);
          onChunkRef.current?.(raw);
          if (done) {
            setStatus('complete');
            onCompleteRef.current?.(partial);
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setStatus('error');
        onErrorRef.current?.(e);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  return { data, status, error, reset };
}

// ---------------------------------------------------------------------------
// Simulation helper - streams pre-baked JSON with realistic delays
// ---------------------------------------------------------------------------
export function createSimulatedStream(
  json: string,
  charsPerChunk = 3,
  baseDelayMs = 18
): ReadableStream<Uint8Array> {
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for (let i = 0; i < json.length; i += charsPerChunk) {
        const chunk = json.slice(i, i + charsPerChunk);
        controller.enqueue(encoder.encode(chunk));
        // Add slight variation to feel more like a real LLM
        const jitter = Math.random() * 12;
        await new Promise((r) => setTimeout(r, baseDelayMs + jitter));
      }
      controller.close();
    },
  });
}
