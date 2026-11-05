import type { None, Option } from "./types.ts";

/**
 * Type guard checking whether an {@linkcode Option} is a {@linkcode None}.
 *
 * Use cautiously: most of the time `.bindNone()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type the value would have had.
 * @param option - The `Option` to inspect.
 * @returns `true` when `option` holds no value.
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
  option: Option<U>,
): option is None<U> => option.type === "NONE";
