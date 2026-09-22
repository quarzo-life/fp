/**
 * A value wrapped so that transformations can be chained fluently.
 *
 * @typeParam U - The wrapped type.
 *
 * @example
 * ```ts
 * import { type IdentityFunctor } from "@quarzo-life/fp";
 *
 * const boxed: IdentityFunctor<number> = identityFunctor(1);
 * ```
 */
export type IdentityFunctor<U> = {
  /** Applies `fn` to the wrapped value and re-wraps the result. */
  readonly map: <V>(fn: (u: U) => V) => IdentityFunctor<V>;
  /** Unwraps the value. */
  readonly get: () => U;
};

/**
 * Wraps a value in an {@linkcode IdentityFunctor} so successive
 * transformations read left to right.
 *
 * @typeParam U - The wrapped type.
 * @param value - The value to wrap.
 * @returns The wrapped value.
 *
 * @example
 * ```ts
 * import { identityFunctor } from "@quarzo-life/fp";
 *
 * identityFunctor(0)
 *   .map((n) => n + 1)
 *   .map((n) => n * 3)
 *   .map((n) => n ** 2)
 *   .get(); // 9
 * ```
 */
export const identityFunctor = <U>(value: U): IdentityFunctor<U> => ({
  map: (fn) => identityFunctor(fn(value)),
  get: () => value,
});
