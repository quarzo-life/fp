/**
 * Functional programming helpers for TypeScript.
 *
 * Every function is pure and side-effect free, so consumers can bundle
 * exactly what they use. The library groups:
 *
 * - **Functions**: `identity`, `compose`, `composeAsync`, `pipe`, `curry`.
 * - **Arrays**: `head`, `last`, `map`, `filter` (data-last, curried).
 * - **Objects**: `prop`, `omit`.
 * - **Guards**: `isDefined`.
 * - **Immutability**: `freeze` and the `Immutable*` types.
 * - **Either**: an optional value (`some` / `none`).
 * - **Result**: a fallible outcome (`success` / `error`), its asynchronous
 *   chain (`asyncResult`), classified failures (`DomainFailure`, …) and a
 *   context-carrying variant (`nextAsyncResult`, `withContext`).
 *
 * @example Quick start
 * ```ts
 * import { error, pipe, success, type Result } from "@quarzo-life/fp";
 *
 * const parse = (raw: string): Result<number, "NOT_A_NUMBER"> => {
 *   const n = Number(raw);
 *   return Number.isNaN(n) ? error("NOT_A_NUMBER") : success(n);
 * };
 *
 * const double = (n: number) => n * 2;
 * const asString = (n: number) => `${n}`;
 *
 * parse("21").bind(pipe(double, asString, success)).fold(
 *   (s) => s,
 *   (e) => e,
 * ); // "42"
 * ```
 *
 * @module
 */
export * from "api/index.ts";
