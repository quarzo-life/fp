import type { Error, Result } from "./types.ts";

/**
 * Type guard checking whether a {@linkcode Result} is an {@linkcode Error}.
 *
 * Use cautiously: most of the time `.bindError()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param result - The `Result` to inspect.
 * @returns `true` when `result` is an error.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsError, error, success } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsError(error("KO")); // true
 * cautiouslyUseIsError(success(1)); // false
 * ```
 */
export const cautiouslyUseIsError = <U, E>(
  result: Result<U, E>,
): result is Error<E> => result.type === "ERROR";
