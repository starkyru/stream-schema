/**
 * Parses a potentially incomplete JSON string using best-effort completion.
 * As tokens stream in, this returns the best possible parsed value at each step.
 *
 * Strategy:
 * 1. Try direct JSON.parse first (handles complete JSON)
 * 2. Walk the string tracking open structures and string state
 * 3. Close any open strings, remove trailing commas, close open brackets/braces
 * 4. Try parsing the completed string
 */
export function parsePartialJSON(partial: string): unknown {
  const trimmed = partial.trim();
  if (!trimmed) return undefined;

  // Fast path: already valid JSON
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue to completion
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

  // Close dangling string
  if (inString) completed += '"';

  // Strip trailing comma + optional whitespace before we close structures
  // e.g. {"a": 1, "b": [1, 2,   -> trailing comma must go
  completed = completed.replace(/,\s*$/, '');

  // Close all open structures in reverse order
  completed += closers.reverse().join('');

  try {
    return JSON.parse(completed);
  } catch {
    // If we still can't parse, the string is too malformed (e.g. mid-key)
    // Try one more time after stripping the last incomplete token
    return parseStrippingLastToken(completed);
  }
}

/**
 * Last resort: strip the last incomplete value/key and try again.
 * Handles cases like: {"title": "Meal pl  (mid-string-value after close attempt)
 */
function parseStrippingLastToken(str: string): unknown {
  // Find the last complete structural character: , : { [ } ]
  const lastStructural = Math.max(
    str.lastIndexOf(','),
    str.lastIndexOf(':'),
    str.lastIndexOf('{'),
    str.lastIndexOf('['),
  );

  if (lastStructural <= 0) return undefined;

  const truncated = str.slice(0, lastStructural);
  return attemptCompletion(truncated);
}
