import type { Either, Some } from "./types.ts";

/**
 * Type guard checking whether an {@linkcode Either} is a {@linkcode Some}.
 *
 * Use cautiously: most of the time `.bind()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type of the value when present.
 * @param either - The `Either` to inspect.
 * @returns `true` when `either` holds a value.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsSome, none, some } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsSome(some(1)); // true
 * cautiouslyUseIsSome(none()); // false
 * ```
 */
export const cautiouslyUseIsSome = <U>(
  either: Either<U>,
): either is Some<U> => either.type === "SOME";
