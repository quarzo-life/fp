import type { ResultMappingFunction, Success } from "./types.ts";

/**
 * Builds a {@linkcode Success} carrying no value (`Success<void>`).
 *
 * Use it for operations that either succeed silently or fail with an error.
 *
 * @returns A `Success<void>`.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsSuccess, successVoid } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsSuccess(successVoid()); // true
 * successVoid().value; // undefined
 * ```
 */
export const successVoid = (): Success<void> => ({
  type: "SUCCESS",
  value: undefined,
  bind: <V, E>(fn: ResultMappingFunction<void, V, E>) => fn(),
  bindError: () => successVoid(),
  fold: <R>(onSuccess: () => R) => onSuccess(),
});
