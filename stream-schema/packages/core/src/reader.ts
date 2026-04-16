import { parsePartialJSON } from './parser';
import type { DeepPartial, StreamChunk, StreamReaderOptions } from './types';

/**
 * Low-level async generator over a ReadableStream<Uint8Array>.
 * Yields raw decoded text chunks as they arrive.
 */
export async function* readRawStream(
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
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

/**
 * Core streaming function. Accumulates chunks, parses partial JSON at each step,
 * and yields typed partial objects as the stream progresses.
 *
 * @example
 * for await (const { partial, done } of streamStructured<MealPlan>(stream)) {
 *   render(partial); // updates live as tokens arrive
 * }
 */
export async function* streamStructured<T>(
  stream: ReadableStream<Uint8Array>,
  options: StreamReaderOptions & { signal?: AbortSignal } = {},
): AsyncGenerator<StreamChunk<T>> {
  const { extractJSON, signal } = options;
  let accumulated = '';

  for await (const rawChunk of readRawStream(stream, signal)) {
    const text = extractJSON ? extractJSON(rawChunk) : rawChunk;
    if (!text) continue;

    accumulated += text;

    const parsed = parsePartialJSON(accumulated);
    if (parsed !== undefined) {
      yield {
        partial: parsed as DeepPartial<T>,
        done: false,
        raw: accumulated,
      };
    }
  }

  // Final yield with done: true
  const finalParsed = parsePartialJSON(accumulated);
  yield {
    partial: (finalParsed ?? {}) as DeepPartial<T>,
    done: true,
    raw: accumulated,
  };
}

// ---------------------------------------------------------------------------
// Provider adapters - extractJSON helpers for common LLM APIs
// ---------------------------------------------------------------------------

/**
 * Extracts JSON content from OpenAI chat completion streaming chunks.
 * OpenAI streams SSE lines like: data: {"choices":[{"delta":{"content":"..."}}]}
 */
export function openAIExtractor(chunk: string): string {
  const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
  return lines
    .map((line) => {
      const json = line.slice('data: '.length).trim();
      if (json === '[DONE]') return '';
      try {
        const parsed = JSON.parse(json);
        return parsed?.choices?.[0]?.delta?.content ?? '';
      } catch {
        return '';
      }
    })
    .join('');
}

/**
 * Extracts JSON content from Anthropic streaming chunks.
 * Anthropic streams SSE lines like: data: {"type":"content_block_delta","delta":{"text":"..."}}
 */
export function anthropicExtractor(chunk: string): string {
  const lines = chunk.split('\n').filter((l) => l.startsWith('data: '));
  return lines
    .map((line) => {
      const json = line.slice('data: '.length).trim();
      try {
        const parsed = JSON.parse(json);
        if (parsed?.type === 'content_block_delta') {
          return parsed?.delta?.text ?? '';
        }
        return '';
      } catch {
        return '';
      }
    })
    .join('');
}
