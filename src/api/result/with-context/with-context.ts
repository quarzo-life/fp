import type { MappingFunction } from "../async-result.ts";
import { success } from "../success.ts";
import type {
  ContextMappingFunction,
  UpdateContextFunction,
  WithContext,
} from "./types.ts";

/**
 * Lifts a context-aware step into a regular {@linkcode MappingFunction} over
 * {@linkcode WithContext} values, so it can be passed to `asyncResult().bind()`.
 *
 * The step receives `[context, updateContext]` and returns the mapping to
 * apply to the value. Calling `updateContext` replaces the context carried
 * to the following steps; otherwise the incoming context is forwarded.
 *
 * @typeParam U - The incoming value type.
 * @typeParam V - The outgoing value type.
 * @typeParam E - The error type the step may produce.
 * @typeParam FromContext - The incoming context type.
 * @typeParam ToContext - The outgoing context type.
 * @param fn - The context-aware step.
 * @returns A mapping function over `WithContext` values.
 *
 * @example
 * ```ts
 * import {
 *   asyncResult,
 *   getTestResult,
 *   success,
 *   withContext,
 *   wrap,
 * } from "@quarzo-life/fp";
 *
 * type Context = { step: number };
 *
 * const add = withContext<number, number, never, Context>(
 *   ([{ step }]) => (n) => success(n + step),
 * );
 *
 * const result = await asyncResult(wrap({ step: 2 })(1)).bind(add).get();
 * getTestResult(result); // { value: 3, context: { step: 2 } }
 * ```
 */
export const withContext = <U, V, E, FromContext, ToContext = FromContext>(
  fn: ContextMappingFunction<U, V, E, FromContext, ToContext>,
): MappingFunction<WithContext<U, FromContext>, WithContext<V, ToContext>, E> =>
async ({ value, context }) => {
  let nextContext: ToContext = context as unknown as ToContext;

  const updateContext: UpdateContextFunction<ToContext> = (context) => {
    nextContext = context;
  };

  return (await fn([context, updateContext])(value)).bind((v) =>
    success<WithContext<V, ToContext>>({ value: v, context: nextContext })
  );
};
