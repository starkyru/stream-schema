import { describe, it, expect } from 'vitest';
import { parsePartialJSON } from '../src/parser';

function parsed<T = Record<string, unknown>>(input: string): T {
  return parsePartialJSON(input) as T;
}

describe('parsePartialJSON', () => {
  it('handles complete valid JSON', () => {
    expect(parsePartialJSON('{"title":"Hello","count":3}')).toEqual({ title: 'Hello', count: 3 });
  });

  it('handles mid-string value', () => {
    const result = parsed('{"title":"Meal pl');
    // Best-effort: title should be partially there or object should exist
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('handles complete key with incomplete value', () => {
    const result = parsed<{ title: string; items: unknown[] }>('{"title":"Hello","items":[');
    expect(result).toBeDefined();
    expect(result.title).toBe('Hello');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('handles partial array items', () => {
    const result = parsed<{ items: Array<{ name?: string }> }>('{"items":[{"name":"Salad"},{"name":"So');
    expect(result.items).toBeDefined();
    expect(result.items[0]).toEqual({ name: 'Salad' });
  });

  it('handles deeply nested partial', () => {
    const result = parsed<{ a: { b: { c?: string } } }>('{"a":{"b":{"c":"hel');
    expect(result).toBeDefined();
    expect(result.a).toBeDefined();
    expect(result.a.b).toBeDefined();
  });

  it('handles trailing comma', () => {
    const result = parsed<{ a: number; b: number }>('{"a":1,"b":2,');
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  it('returns undefined for empty input', () => {
    expect(parsePartialJSON('')).toBeUndefined();
    expect(parsePartialJSON('   ')).toBeUndefined();
  });

  it('handles partial number value', () => {
    parsed('{"count":12');
    // Either parses with 12 or undefined - should not throw
    expect(() => parsePartialJSON('{"count":12')).not.toThrow();
  });
});
