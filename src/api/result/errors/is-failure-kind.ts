import type { FailureKind } from "./failure-kind.ts";
import { ResultError } from "./result-error.ts";

/**
 * Type guard checking whether an unknown value is a {@linkcode ResultError}
 * classified with the given {@linkcode FailureKind}.
 *
 * @typeParam Kind - The failure kind to test for.
 * @param value - Any value, typically the `error` of a `Result`.
 * @param kind - The expected failure kind.
 * @returns `true` when `value` is a classified `ResultError` of kind `kind`.
 *
 * @example
 * ```ts
 * import { DomainFailure, isFailureKind } from "@quarzo-life/fp";
 *
 * const failure = new DomainFailure("Not enough cash", "INSUFFICIENT_FUNDS");
 *
 * isFailureKind(failure, "DOMAIN"); // true
 * isFailureKind(failure, "TRANSIENT_TECHNICAL"); // false
 * isFailureKind("oops", "DOMAIN"); // false
 * ```
 */
export const isFailureKind = <Kind extends FailureKind>(
  value: unknown,
  kind: Kind,
): value is ResultError<string> & { readonly failureKind: Kind } =>
  value instanceof ResultError &&
  "failureKind" in value &&
  value.failureKind === kind;
