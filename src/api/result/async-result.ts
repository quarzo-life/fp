import { cautiouslyUseIsError } from "./cautiously-use-is-error.ts";
import { cautiouslyUseIsSuccess } from "./cautiously-use-is-success.ts";
import type { Error, Result } from "./types.ts";

/**
 * A function mapping a success value to a new {@linkcode Result}, possibly
 * asynchronously.
 *
 * Argument type of `AsyncResult.bind`.
 *
 * @example
 * ```ts
 * import { type MappingFunction, success } from "@quarzo-life/fp";
 *
 * const increment: MappingFunction<number, number, never> = async (n) =>
 *   success(n + 1);
 * ```
 */
export type MappingFunction<U, V, F> = (
  u: U,
) => Result<V, F> | Promise<Result<V, F>>;

/**
 * A function mapping an error to a new {@linkcode Result}, possibly
 * asynchronously.
 *
 * Argument type of `AsyncResult.bindError`.
 *
 * @example
 * ```ts
 * import { type AsyncErrorMappingFunction, success } from "@quarzo-life/fp";
 *
 * const recover: AsyncErrorMappingFunction<number, string, never> = async () =>
 *   success(0);
 * ```
 */
export type AsyncErrorMappingFunction<U, E, F> = (
  e: E,
) => Result<U, F> | Promise<Result<U, F>>;

/**
 * A chainable wrapper around a `Promise<Result>`.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { type AsyncResult, asyncResult, success } from "@quarzo-life/fp";
 *
 * const pending: AsyncResult<number, never> = asyncResult(
 *   Promise.resolve(success(1)),
 * );
 * ```
 */
export type AsyncResult<U, E> = {
  /** Chains a (possibly async) computation on the success value. */
  readonly bind: <V, F = E>(
    fn: MappingFunction<U, V, F>,
  ) => AsyncResult<V, E | F>;
  /**
   * Transforms the success value with a synchronous function that cannot
   * fail; no-op on `Error`. Same as `.bind((u) => success(fn(u)))`.
   */
  readonly map: <V>(fn: (u: U) => V) => AsyncResult<V, E>;
  /** Chains a (possibly async) computation on the error. */
  readonly bindError: <F = E>(
    fn: AsyncErrorMappingFunction<U, E, F>,
  ) => AsyncResult<U, F>;
  /** Resolves to the underlying `Result`. */
  readonly get: () => Promise<Result<U, E>>;
};

/**
 * Wraps a `Promise<Result>` so asynchronous steps can be chained with
 * `.bind()` / `.map()` / `.bindError()` without manual `await`s, then resolved
 * with `.get()`.
 *
 * Errors short-circuit: once a step yields an `Error`, later `bind`s and
 * `map`s are skipped and the error is forwarded.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param promise - The promise to wrap.
 * @returns A chainable `AsyncResult`.
 *
 * @example
 * ```ts
 * import { asyncResult, getTestResult, success } from "@quarzo-life/fp";
 *
 * const increment = (n: number) => Promise.resolve(success(n + 1));
 * const square = (n: number) => Promise.resolve(success(n ** 2));
 *
 * const result = await asyncResult(Promise.resolve(success(1)))
 *   .bind(increment)
 *   .bind(square)
 *   .get();
 * getTestResult(result); // 4
 * ```
 *
 * @example
 * ```ts
 * import { asyncResult, getTestResult, success } from "@quarzo-life/fp";
 *
 * const result = await asyncResult(Promise.resolve(success(1)))
 *   .map((n) => n + 1)
 *   .get();
 * getTestResult(result); // 2
 * ```
 */
export const asyncResult = <U, E = string>(
  promise: Promise<Result<U, E>>,
): AsyncResult<U, E> => ({
  bind: <V, F = E>(fn: MappingFunction<U, V, F>) => {
    const next = promise.then<Error<E> | Result<V, F>, never>(
      (result) => {
        if (cautiouslyUseIsSuccess(result)) {
          return fn(result.value);
        }
        return Promise.resolve(result);
      },
    );
    return asyncResult<V, E | F>(next as Promise<Result<V, E | F>>);
  },
  map: <V>(fn: (u: U) => V) =>
    asyncResult<V, E>(promise.then((result) => result.map(fn))),
  bindError: (fn) => {
    const next = promise.then((result) => {
      if (cautiouslyUseIsError(result)) {
        return fn(result.error);
      }
      return result;
    });
    return asyncResult(next);
  },
  get: () => promise,
});
