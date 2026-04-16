import type { ZodTypeAny, infer as ZodInfer } from 'zod';
import type { DeepPartial } from '@stream-schema/core';
import type { UseStructuredStreamOptions, UseStructuredStreamResult } from '@stream-schema/react';
import { useStructuredStream } from '@stream-schema/react';

export interface UseSchemaStreamOptions<TSchema extends ZodTypeAny>
  extends Omit<UseStructuredStreamOptions<ZodInfer<TSchema>>, 'stream'> {
  stream: ReadableStream<Uint8Array> | null | undefined;
  /**
   * Zod schema. Used only for type inference - no runtime validation during streaming
   * (partial data is intentionally incomplete). Validates on complete if validateOnComplete is true.
   */
  schema: TSchema;
  /**
   * Run full Zod validation when streaming completes.
   * Calls onError if validation fails.
   * @default false
   */
  validateOnComplete?: boolean;
}

/**
 * Schema-first wrapper around useStructuredStream.
 * Types are inferred from the Zod schema automatically.
 *
 * @example
 * const schema = z.object({
 *   title: z.string(),
 *   items: z.array(z.object({ name: z.string(), calories: z.number() }))
 * });
 *
 * const { data, status } = useSchemaStream({ stream, schema });
 * // data is typed as DeepPartial<{ title: string; items: Array<...> }>
 */
export function useSchemaStream<TSchema extends ZodTypeAny>({
  schema,
  stream,
  validateOnComplete = false,
  onComplete,
  onError,
  ...rest
}: UseSchemaStreamOptions<TSchema>): UseStructuredStreamResult<ZodInfer<TSchema>> {
  return useStructuredStream<ZodInfer<TSchema>>({
    stream,
    ...rest,
    onComplete: (data) => {
      if (validateOnComplete) {
        const result = schema.safeParse(data);
        if (!result.success) {
          onError?.(new Error(`Schema validation failed: ${result.error.message}`));
          return;
        }
        onComplete?.(result.data as DeepPartial<ZodInfer<TSchema>>);
      } else {
        onComplete?.(data);
      }
    },
    onError,
  });
}
