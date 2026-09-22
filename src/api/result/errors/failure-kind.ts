/**
 * How a failure should be handled by the caller.
 *
 * - `DOMAIN`: a business rule was violated; retrying will not help.
 * - `TRANSIENT_TECHNICAL`: a technical hiccup (network, timeout…) that may
 *   succeed on retry.
 * - `PERMANENT_TECHNICAL`: a technical failure that will not resolve by
 *   itself (misconfiguration, bug…).
 *
 * @example
 * ```ts
 * import { type FailureKind } from "@quarzo-life/fp";
 *
 * const retryable: FailureKind = "TRANSIENT_TECHNICAL";
 * ```
 */
export type FailureKind =
  | "DOMAIN"
  | "TRANSIENT_TECHNICAL"
  | "PERMANENT_TECHNICAL";
