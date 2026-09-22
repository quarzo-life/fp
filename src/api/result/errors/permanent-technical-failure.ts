import { FailureClassifiedError } from "./failure-classified-error.ts";

/**
 * A technical failure that will not resolve by itself (misconfiguration,
 * programming error, unsupported input…).
 *
 * @typeParam Code - The literal type of the error code.
 *
 * @example
 * ```ts
 * import { PermanentTechnicalFailure } from "@quarzo-life/fp";
 *
 * class MissingConfig extends PermanentTechnicalFailure<"MISSING_CONFIG"> {
 *   constructor(key: string) {
 *     super(`Configuration key ${key} is missing`, "MISSING_CONFIG");
 *   }
 * }
 *
 * new MissingConfig("DB_URL").failureKind; // "PERMANENT_TECHNICAL"
 * ```
 */
export class PermanentTechnicalFailure<Code extends string>
  extends FailureClassifiedError<Code, "PERMANENT_TECHNICAL"> {
  /** Always `"PERMANENT_TECHNICAL"`. */
  readonly failureKind: "PERMANENT_TECHNICAL" = "PERMANENT_TECHNICAL";
}
