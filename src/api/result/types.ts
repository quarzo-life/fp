/**
 * A function mapping a success value to a new {@linkcode Result}.
 *
 * Argument type of `Result.bind`.
 *
 * @example
 * ```ts
 * import { type ResultMappingFunction, success } from "@quarzo-life/fp";
 *
 * const increment: ResultMappingFunction<number, number, never> = (n) =>
 *   success(n + 1);
 * ```
 */
export type ResultMappingFunction<U, V, F> = (u: U) => Result<V, F>;

/**
 * A function mapping an error to a new {@linkcode Result}.
 *
 * Argument type of `Result.bindError`.
 *
 * @example
 * ```ts
 * import { type ResultErrorMappingFunction, success } from "@quarzo-life/fp";
 *
 * const recover: ResultErrorMappingFunction<number, string, never> = () =>
 *   success(0);
 * ```
 */
export type ResultErrorMappingFunction<U, E, F> = (e: E) => Result<U, F>;

/**
 * The operations shared by {@linkcode Success} and {@linkcode Error}.
 *
 * @typeParam Type - The discriminant (`"SUCCESS"` or `"ERROR"`).
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { type AbstractResult } from "@quarzo-life/fp";
 *
 * type Ok = AbstractResult<"SUCCESS", number, never>;
 * ```
 */
export type AbstractResult<Type, U, E> = {
  /** Discriminant, `"SUCCESS"` or `"ERROR"`. */
  readonly type: Type;
  /** Chains a computation on the success value; no-op on `Error`. */
  readonly bind: <V, F = E>(
    fn: ResultMappingFunction<U, V, F>,
  ) => Result<V, E | F>;
  /** Chains a computation on the error; no-op on `Success`. */
  readonly bindError: <F = E>(
    fn: ResultErrorMappingFunction<U, E, F>,
  ) => Result<U, F>;
  /** Collapses the `Result` by handling both cases. */
  readonly fold: <Rs, Re>(
    onSuccess: (u: U) => Rs,
    onError: (error: E) => Re,
  ) => Rs | Re;
};

/**
 * A {@linkcode Result} holding a success value.
 *
 * @typeParam U - The type of the value.
 *
 * @example
 * ```ts
 * import { type Success, success } from "@quarzo-life/fp";
 *
 * const ok: Success<number> = success(1);
 * ok.value; // 1
 * ```
 */
export type Success<U> = AbstractResult<"SUCCESS", U, never> & {
  readonly value: U;
};

/**
 * A {@linkcode Result} holding an error.
 *
 * Note that this type shadows the global `Error` when imported; alias it
 * (`import { type Error as ResultErr }`) if you need both in one file.
 *
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { type Error, error } from "@quarzo-life/fp";
 *
 * const failed: Error<string> = error("NOT_FOUND");
 * failed.error; // "NOT_FOUND"
 * ```
 */
export type Error<E> = AbstractResult<"ERROR", never, E> & {
  readonly error: E;
};

/**
 * The outcome of a computation that can fail: either {@linkcode Success}
 * or {@linkcode Error}.
 *
 * Prefer `.bind()`, `.bindError()` and `.fold()` over inspecting `.type`
 * directly.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 *
 * @example
 * ```ts
 * import { type Result, error, success } from "@quarzo-life/fp";
 *
 * const parse = (raw: string): Result<number, "NOT_A_NUMBER"> => {
 *   const n = Number(raw);
 *   return Number.isNaN(n) ? error("NOT_A_NUMBER") : success(n);
 * };
 *
 * parse("42").fold((n) => n * 2, () => 0); // 84
 * parse("x").fold((n) => n * 2, () => 0); // 0
 * ```
 */
export type Result<U, E> = Success<U> | Error<E>;
