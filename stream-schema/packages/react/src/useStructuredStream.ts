import { useCallback, useEffect, useRef, useState } from 'react';
import { streamStructured } from '@stream-schema/core';
import type { DeepPartial, StreamStatus, StreamReaderOptions } from '@stream-schema/core';

export interface UseStructuredStreamOptions<T> extends StreamReaderOptions {
  /** The ReadableStream to consume. Pass null/undefined to stay idle. */
  stream: ReadableStream<Uint8Array> | null | undefined;
  /** Called once when streaming completes successfully. */
  onComplete?: (data: DeepPartial<T>) => void;
  /** Called when an error occurs. */
  onError?: (error: Error) => void;
}

export interface UseStructuredStreamResult<T> {
  /** Current best-effort parsed value. Updates on every token. Undefined until first chunk arrives. */
  data: DeepPartial<T> | undefined;
  /** Current streaming status. */
  status: StreamStatus;
  /** Error, if status === 'error'. */
  error: Error | null;
  /** Reset state back to idle and abort any active stream. */
  reset: () => void;
}

/**
 * Core hook. Consumes a ReadableStream and exposes a live DeepPartial<T>
 * that updates as tokens stream in.
 *
 * @example
 * const stream = await fetch('/api/generate').then(r => r.body);
 *
 * const { data, status } = useStructuredStream<MealPlan>({ stream });
 * // data.title updates character by character
 * // data.items grows as each item completes
 */
export function useStructuredStream<T>({
  stream,
  onComplete,
  onError,
  extractJSON,
}: UseStructuredStreamOptions<T>): UseStructuredStreamResult<T> {
  const [data, setData] = useState<DeepPartial<T> | undefined>(undefined);
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Keep callbacks stable without adding to effect deps
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

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
        for await (const { partial, done } of streamStructured<T>(stream, {
          extractJSON,
          signal: controller.signal,
        })) {
          if (controller.signal.aborted) return;

          setData(partial);

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
  // Only re-run when stream reference changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  return { data, status, error, reset };
}
