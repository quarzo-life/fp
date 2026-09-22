import type { Error, Result } from "./types.ts";

/**
 * Unwraps a {@linkcode Result}, assuming it is an {@linkcode Error}.
 *
 * Intended for tests only: on a `Success` it returns `undefined` rather than
 * throwing, so the assertion on the returned error is what fails.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param result - The `Result` to unwrap.
 * @returns The error.
 *
 * @example
 * ```ts
 * import { error, getTestError } from "@quarzo-life/fp";
 *
 * getTestError(error("NOT_FOUND")); // "NOT_FOUND"
 * ```
 */
export const getTestError = <U, E>(result: Result<U, E>): E =>
  (result as Error<E>).error;
