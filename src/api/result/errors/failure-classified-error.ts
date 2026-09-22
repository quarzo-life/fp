import type { FailureKind } from "./failure-kind.ts";
import { ResultError } from "./result-error.ts";

/**
 * A {@linkcode ResultError} tagged with a {@linkcode FailureKind}.
 *
 * Base class of {@linkcode DomainFailure},
 * {@linkcode TransientTechnicalFailure} and
 * {@linkcode PermanentTechnicalFailure}; extend one of those rather than this
 * class directly.
 *
 * @typeParam Code - The literal type of the error code.
 * @typeParam Kind - The failure kind.
 *
 * @example
 * ```ts
 * import { type FailureClassifiedError, DomainFailure } from "@quarzo-life/fp";
 *
 * const failure: FailureClassifiedError<"INSUFFICIENT_FUNDS", "DOMAIN"> =
 *   new DomainFailure("Not enough cash", "INSUFFICIENT_FUNDS");
 * ```
 */
export abstract class FailureClassifiedError<
  Code extends string,
  Kind extends FailureKind,
> extends ResultError<Code> {
  /** The failure kind. */
  abstract readonly failureKind: Kind;
}
