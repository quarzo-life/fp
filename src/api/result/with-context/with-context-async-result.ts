import { asyncResult } from "../async-result.ts";
import { cautiouslyUseIsError } from "../cautiously-use-is-error.ts";
import type { Result } from "../types.ts";
import type {
  ContextMappingFunction,
  ErrorMappingFunction,
  WithContext,
} from "./types.ts";
import { unwrap } from "./unwrap.ts";
import { withContext } from "./with-context.ts";

/**
 * A chainable wrapper around a `Promise<Result<WithContext>>` whose `bind`
 * takes context-aware steps directly, without wrapping them in
 * {@linkcode withContext}.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @typeParam FromContext - The type of the current context.
 *
 * @example
 * ```ts
 * import { type WithContextAsyncResult, nextAsyncResult, success } from "@quarzo-life/fp";
 *
 * const chain: WithContextAsyncResult<number, never, { step: number }> =
 *   nextAsyncResult(Promise.resolve(success(1)), { step: 2 });
 * ```
 */
export type WithContextAsyncResult<U, E, FromContext> = {
  /** Chains a context-aware step on the success value. */
  readonly bind: <V, F, ToContext = FromContext>(
    fn: ContextMappingFunction<U, V, F, FromContext, ToContext>,
  ) => WithContextAsyncResult<V, E | F, ToContext>;
  /** Chains a (possibly async) computation on the error. */
  readonly bindError: <F>(
    fn: ErrorMappingFunction<E, F>,
  ) => WithContextAsyncResult<U, F, FromContext>;
  /** Resolves to the underlying `Result`, with the context dropped. */
  readonly get: () => Promise<Result<U, E>>;
};

/**
 * Wraps a `Promise<Result<WithContext>>` into a
 * {@linkcode WithContextAsyncResult}.
 *
 * Prefer {@linkcode nextAsyncResult}, which also takes care of pairing the
 * initial value with its context.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @typeParam FromContext - The type of the initial context.
 * @param promise - The promise to wrap.
 * @returns A chainable `WithContextAsyncResult`.
 *
 * @example
 * ```ts
 * import {
 *   getTestResult,
 *   success,
 *   withContextAsyncResult,
 *   wrap,
 * } from "@quarzo-life/fp";
 *
 * const result = await withContextAsyncResult(wrap({ step: 2 })(1))
 *   .bind(([{ step }]) => (n: number) => success(n + step))
 *   .get();
 * getTestResult(result); // 3
 * ```
 */
export const withContextAsyncResult = <U, E, FromContext>(
  promise: Promise<Result<WithContext<U, FromContext>, E>>,
): WithContextAsyncResult<U, E, FromContext> => ({
  bind: <V, F = E, ToContext = FromContext>(
    fn: ContextMappingFunction<U, V, F, FromContext, ToContext>,
  ) => {
    const next = asyncResult(promise)
      .bind(withContext(fn))
      .get();
    return withContextAsyncResult(next);
  },
  bindError: <F = E>(
    fn: ErrorMappingFunction<E, F>,
  ) => {
    const next = promise.then((r) => {
      if (cautiouslyUseIsError(r)) {
        return fn(r.error);
      }
      return r;
    });
    return withContextAsyncResult(next);
  },
  get: () =>
    asyncResult(promise)
      .bind(unwrap)
      .get(),
});
