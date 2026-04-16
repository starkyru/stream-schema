// Recursively makes all properties optional and nullable - matches partial JSON state
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T | undefined;

export type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

export interface StreamChunk<T> {
  partial: DeepPartial<T>;
  done: boolean;
  raw: string;
}

// Options for reading a stream - handles different provider formats
export interface StreamReaderOptions {
  /**
   * Extract the JSON text from a raw chunk.
   * Use this for SSE formats (OpenAI, Anthropic) that wrap JSON in "data: ..." lines.
   * Defaults to treating the entire chunk as raw JSON.
   */
  extractJSON?: (chunk: string) => string;
}
