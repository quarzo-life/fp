import type { None, NoneMappingFunction } from "./types.ts";

/**
 * Builds a {@linkcode None}: an {@linkcode Either} holding no value.
 *
 * `bind` is a no-op returning `None`; `bindNone` applies its function;
 * `fold` calls `onNone`.
 *
 * @typeParam U - The type the value would have had.
 * @returns A `None`.
 *
 * @example
 * ```ts
 * import { getTestSome, none, some } from "@quarzo-life/fp";
 *
 * const either = none<number>().bindNone(() => some(1));
 * getTestSome(either); // 1
 * ```
 */
export const none = <U>(): None<U> => ({
  type: "NONE",
  bind: <V>() => none<V>(),
  bindNone: <V>(fn: NoneMappingFunction<V>) => fn(),
  fold: <R>(_: (u: U) => R, onNone: () => R): R => onNone(),
});
