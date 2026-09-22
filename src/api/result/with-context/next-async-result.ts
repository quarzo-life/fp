import type { Result } from "../types.ts";
import { promiseResultWrap } from "./promise-result-wrap.ts";
import {
  type WithContextAsyncResult,
  withContextAsyncResult,
} from "./with-context-async-result.ts";

/**
 * Wraps a `Promise<Result>` into a context-aware chain, pairing the success
 * value with `context` (an empty object when omitted).
 *
 * Each `.bind()` step receives `[context, updateContext]` and returns the
 * mapping to apply to the value; `.get()` resolves to the plain `Result`
 * with the context dropped.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param promise - The promise to wrap.
 * @returns A chainable `WithContextAsyncResult` with an empty context.
 *
 * @example
 * ```ts
 * import { getTestResult, nextAsyncResult, success } from "@quarzo-life/fp";
 *
 * const result = await nextAsyncResult(Promise.resolve(success(1)), { step: 2 })
 *   .bind(([{ step }]) => (n: number) => success(n + step))
 *   .get();
 * getTestResult(result); // 3
 * ```
 */
export function nextAsyncResult<U, E>(
  promise: Promise<Result<U, E>>,
): WithContextAsyncResult<U, E, Record<string, never>>;
/**
 * Wraps a `Promise<Result>` into a context-aware chain with an initial
 * context.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @typeParam Context - The type of the context.
 * @param promise - The promise to wrap.
 * @param context - The initial context.
 * @returns A chainable `WithContextAsyncResult` carrying `context`.
 */
export function nextAsyncResult<U, E, Context>(
  promise: Promise<Result<U, E>>,
  context: Context,
): WithContextAsyncResult<U, E, Context>;
export function nextAsyncResult<U, E, Context = Record<string, never>>(
  promise: Promise<Result<U, E>>,
  context?: Context,
): WithContextAsyncResult<U, E, Context> {
  const initialContext = context ?? ({} as Context);
  return withContextAsyncResult(
    promiseResultWrap(initialContext)(promise),
  );
}
