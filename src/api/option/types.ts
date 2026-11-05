/**
 * A function mapping a present value to a new {@linkcode Option}.
 *
 * Argument type of `Option.bind`.
 *
 * @example
 * ```ts
 * import { type SomeMappingFunction, some } from "@quarzo-life/fp";
 *
 * const increment: SomeMappingFunction<number, number> = (n) => some(n + 1);
 * ```
 */
export type SomeMappingFunction<U, V> = (u: U) => Option<V>;

/**
 * A function producing a fallback {@linkcode Option} from an absent value.
 *
 * Argument type of `Option.bindNone`.
 *
 * @example
 * ```ts
 * import { type NoneMappingFunction, some } from "@quarzo-life/fp";
 *
 * const fallback: NoneMappingFunction<number> = () => some(0);
 * ```
 */
export type NoneMappingFunction<V> = () => Option<V>;

/**
 * The operations shared by {@linkcode Some} and {@linkcode None}.
 *
 * @typeParam Type - The discriminant (`"SOME"` or `"NONE"`).
 * @typeParam U - The type of the value when present.
 *
 * @example
 * ```ts
 * import { type AbstractOption } from "@quarzo-life/fp";
 *
 * type Present = AbstractOption<"SOME", number>;
 * ```
 */
export type AbstractOption<Type, U> = {
  /** Discriminant, `"SOME"` or `"NONE"`. */
  readonly type: Type;
  /** Chains a computation on the value when present; no-op on `None`. */
  readonly bind: <V>(fn: SomeMappingFunction<U, V>) => Option<V>;
  /**
   * Provides a fallback when the value is absent; no-op on `Some`.
   *
   * The result is typed `Option<U | V>` rather than `Option<U>` so that
   * `Option` stays covariant in `U` (an `Option<Sub>` remains assignable to
   * an `Option<Super>`).
   */
  readonly bindNone: <V>(fn: NoneMappingFunction<V>) => Option<U | V>;
  /** Collapses the `Option` by handling both cases. */
  readonly fold: <R>(
    onSome: (u: U) => R,
    onNone: () => R,
  ) => R;
};

/**
 * An {@linkcode Option} holding a value.
 *
 * @typeParam U - The type of the value.
 *
 * @example
 * ```ts
 * import { type Some, some } from "@quarzo-life/fp";
 *
 * const present: Some<number> = some(1);
 * present.value; // 1
 * ```
 */
export type Some<U> = AbstractOption<"SOME", U> & { readonly value: U };

/**
 * An {@linkcode Option} holding no value.
 *
 * @typeParam U - The type the value would have had.
 *
 * @example
 * ```ts
 * import { type None, none } from "@quarzo-life/fp";
 *
 * const absent: None<number> = none();
 * ```
 */
export type None<U> = AbstractOption<"NONE", U>;

/**
 * An optional value: either {@linkcode Some} or {@linkcode None}.
 *
 * Prefer `.bind()`, `.bindNone()` and `.fold()` over inspecting `.type`
 * directly.
 *
 * @typeParam U - The type of the value when present.
 *
 * @example
 * ```ts
 * import { type Option, none, some } from "@quarzo-life/fp";
 *
 * const find = (id: string): Option<string> =>
 *   id === "1" ? some("Case") : none();
 *
 * find("1").fold((name) => `Hello ${name}`, () => "Unknown"); // "Hello Case"
 * find("2").fold((name) => `Hello ${name}`, () => "Unknown"); // "Unknown"
 * ```
 */
export type Option<U> = Some<U> | None<U>;
