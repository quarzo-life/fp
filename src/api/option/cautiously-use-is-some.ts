import type { Option, Some } from "./types.ts";

/**
 * Type guard checking whether an {@linkcode Option} is a {@linkcode Some}.
 *
 * Use cautiously: most of the time `.bind()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type of the value when present.
 * @param option - The `Option` to inspect.
 * @returns `true` when `option` holds a value.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsSome, none, some } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsSome(some(1)); // true
 * cautiouslyUseIsSome(none()); // false
 * ```
 */
export const cautiouslyUseIsSome = <U>(option: Option<U>): option is Some<U> =>
  option.type === "SOME";
