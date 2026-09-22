import type { Error, ResultErrorMappingFunction } from "./types.ts";

/**
 * Builds an {@linkcode Error}: a {@linkcode Result} holding the error `e`.
 *
 * `bind` is a no-op propagating the error; `bindError` applies its function;
 * `fold` calls `onError`.
 *
 * @typeParam E - The type of the error.
 * @param e - The error.
 * @returns An `Error` wrapping `e`.
 *
 * @example
 * ```ts
 * import { error, getTestError, success } from "@quarzo-life/fp";
 *
 * const result = error("NOT_FOUND").bind((n: number) => success(n + 1));
 * getTestError(result); // "NOT_FOUND"
 * ```
 */
export const error = <E>(e: E): Error<E> => ({
  type: "ERROR",
  error: e,
  bind: <F>() => error<E | F>(e),
  bindError: <U, F = E>(fn: ResultErrorMappingFunction<U, E, F>) => fn(e),
  fold: <U, Rs, Re>(_: (u: U) => Rs, onError: (e: E) => Re) => onError(e),
});
