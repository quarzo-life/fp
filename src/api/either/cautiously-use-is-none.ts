import type { Either, None } from "./types.ts";

/**
 * Type guard checking whether an {@linkcode Either} is a {@linkcode None}.
 *
 * Use cautiously: most of the time `.bindNone()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type the value would have had.
 * @param either - The `Either` to inspect.
 * @returns `true` when `either` holds no value.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsNone, none, some } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsNone(none()); // true
 * cautiouslyUseIsNone(some(1)); // false
 * ```
 */
export const cautiouslyUseIsNone = <U>(
  either: Either<U>,
): either is None<U> => either.type === "NONE";
