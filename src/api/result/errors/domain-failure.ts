import { FailureClassifiedError } from "./failure-classified-error.ts";

/**
 * A failure caused by a violated business rule. Retrying will not help.
 *
 * @typeParam Code - The literal type of the error code.
 *
 * @example
 * ```ts
 * import { DomainFailure, error } from "@quarzo-life/fp";
 *
 * class InsufficientFunds extends DomainFailure<"INSUFFICIENT_FUNDS"> {
 *   constructor() {
 *     super("Not enough cash on the account", "INSUFFICIENT_FUNDS");
 *   }
 * }
 *
 * error(new InsufficientFunds()).error.failureKind; // "DOMAIN"
 * ```
 */
export class DomainFailure<Code extends string>
  extends FailureClassifiedError<Code, "DOMAIN"> {
  /** Always `"DOMAIN"`. */
  readonly failureKind: "DOMAIN" = "DOMAIN";
}
