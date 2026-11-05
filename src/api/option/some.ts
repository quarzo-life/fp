import type {
  NoneMappingFunction,
  Option,
  Some,
  SomeMappingFunction,
} from "./types.ts";

/**
 * Builds a {@linkcode Some}: an {@linkcode Option} holding `value`.
 *
 * `bind` applies its function to the value; `bindNone` is a no-op returning
 * the same value; `fold` calls `onSome`.
 *
 * @typeParam U - The type of the value.
 * @param value - The value.
 * @returns A `Some` wrapping `value`.
 *
 * @example
 * ```ts
 * import { getTestSome, some } from "@quarzo-life/fp";
 *
 * const option = some(0).bind((n) => some(n + 1));
 * getTestSome(option); // 1
 * ```
 */
export const some = <U>(value: U): Some<U> => ({
  type: "SOME",
  value,
  bind: <V>(fn: SomeMappingFunction<U, V>) => fn(value),
  bindNone: <V>(_: NoneMappingFunction<V>): Option<U | V> => some(value),
  fold: <R>(onSome: (u: U) => R): R => onSome(value),
});
