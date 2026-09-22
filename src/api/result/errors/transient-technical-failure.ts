import { FailureClassifiedError } from "./failure-classified-error.ts";

/**
 * A technical failure that may succeed on retry (network error, timeout,
 * lock contention…).
 *
 * @typeParam Code - The literal type of the error code.
 *
 * @example
 * ```ts
 * import { TransientTechnicalFailure } from "@quarzo-life/fp";
 *
 * class Timeout extends TransientTechnicalFailure<"TIMEOUT"> {
 *   constructor() {
 *     super("The upstream service did not answer in time", "TIMEOUT");
 *   }
 * }
 *
 * new Timeout().failureKind; // "TRANSIENT_TECHNICAL"
 * ```
 */
export class TransientTechnicalFailure<Code extends string>
  extends FailureClassifiedError<Code, "TRANSIENT_TECHNICAL"> {
  /** Always `"TRANSIENT_TECHNICAL"`. */
  readonly failureKind: "TRANSIENT_TECHNICAL" = "TRANSIENT_TECHNICAL";
}
