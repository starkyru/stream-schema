import { describe, it, expect } from 'vitest';
import { parsePartialJSON } from '../src/parser';

describe('parsePartialJSON', () => {
  it('handles complete valid JSON', () => {
    expect(parsePartialJSON('{"title":"Hello","count":3}')).toEqual({ title: 'Hello', count: 3 });
  });

  it('handles mid-string value', () => {
    const result = parsePartialJSON('{"title":"Meal pl') as any;
    // Best-effort: title should be partially there or object should exist
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('handles complete key with incomplete value', () => {
    const result = parsePartialJSON('{"title":"Hello","items":[') as any;
    expect(result).toBeDefined();
    expect(result.title).toBe('Hello');
    expect(Array.isArray(result.items)).toBe(true);
  });

  it('handles partial array items', () => {
    const result = parsePartialJSON('{"items":[{"name":"Salad"},{"name":"So') as any;
    expect(result.items).toBeDefined();
    expect(result.items[0]).toEqual({ name: 'Salad' });
  });

  it('handles deeply nested partial', () => {
    const result = parsePartialJSON('{"a":{"b":{"c":"hel') as any;
    expect(result).toBeDefined();
    expect(result.a).toBeDefined();
    expect(result.a.b).toBeDefined();
  });

  it('handles trailing comma', () => {
    const result = parsePartialJSON('{"a":1,"b":2,') as any;
    expect(result.a).toBe(1);
    expect(result.b).toBe(2);
  });

  it('returns undefined for empty input', () => {
    expect(parsePartialJSON('')).toBeUndefined();
    expect(parsePartialJSON('   ')).toBeUndefined();
  });

  it('handles partial number value', () => {
    const result = parsePartialJSON('{"count":12') as any;
    // Either parses with 12 or undefined - should not throw
    expect(() => parsePartialJSON('{"count":12')).not.toThrow();
  });
});
