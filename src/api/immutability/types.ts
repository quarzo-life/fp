/**
 * A shallowly immutable view of `T`.
 *
 * Return type of {@linkcode freeze}.
 *
 * @example
 * ```ts
 * import { type Immutable } from "@quarzo-life/fp";
 *
 * const config: Immutable<{ retries: number }> = { retries: 3 };
 * ```
 */
export type Immutable<T> = Readonly<T>;

/**
 * A shallowly immutable array of `T`.
 *
 * @example
 * ```ts
 * import { type ImmutableArray } from "@quarzo-life/fp";
 *
 * const tags: ImmutableArray<string> = ["wealth", "insurance"];
 * ```
 */
export type ImmutableArray<T> = ReadonlyArray<T>;

/**
 * A shallowly immutable record keyed by `K`.
 *
 * @example
 * ```ts
 * import { type ImmutableRecord } from "@quarzo-life/fp";
 *
 * const counts: ImmutableRecord<string, number> = { posts: 2 };
 * ```
 */
export type ImmutableRecord<K extends PropertyKey, V> = Readonly<
  Record<K, V>
>;
