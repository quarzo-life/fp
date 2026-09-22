/**
 * Run with: deno run examples/advanced.ts
 *
 * A more subtle example than examples/basic.ts: an async chain that carries
 * a context between steps (`nextAsyncResult`), where one step enriches that
 * context for the ones after it, and a classified `DomainFailure` lets the
 * caller decide whether retrying would even help.
 */
import {
  type ContextParameters,
  DomainFailure,
  error,
  isFailureKind,
  nextAsyncResult,
  success,
} from "../mod.ts";

type Context = { readonly requestId: string; readonly startedAt?: number };

const balances = new Map([["ada", 50]]);

const withdraw = (accountId: string, amount: number) =>
  nextAsyncResult(
    Promise.resolve(success(amount)),
    { requestId: crypto.randomUUID() } as Context,
  )
    .bind(
      ([context, updateContext]: ContextParameters<Context>) => (n: number) => {
        // Enrich the context for every step after this one.
        updateContext({ ...context, startedAt: Date.now() });
        return success(n);
      },
    )
    .bind(([{ requestId }]: ContextParameters<Context>) => (n: number) => {
      const balance = balances.get(accountId) ?? 0;
      if (balance < n) {
        return error(
          new DomainFailure(
            `[${requestId}] Not enough cash on "${accountId}"`,
            "INSUFFICIENT_FUNDS",
          ),
        );
      }
      balances.set(accountId, balance - n);
      return success(balances.get(accountId)!);
    })
    .get();

const result = await withdraw("ada", 80);

result.fold(
  (balance) => console.log(`New balance: ${balance}`),
  (failure) =>
    console.log(
      isFailureKind(failure, "DOMAIN")
        ? `Rejected, do not retry: ${failure.message}`
        : `Unexpected error: ${failure}`,
    ),
);
