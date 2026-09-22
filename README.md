<p align="center">
  <img src=".github/assets/logo.svg" alt="fp logo" width="96" height="96">
</p>

<p align="center">
  <h1>fp</h1>
</p>

<p align="center">
  <strong>Functional programming helpers for TypeScript.</strong>
</p>

<p align="center">
  A lightweight, dependency-free collection of pure functions.
</p>

---

## 📦 Install

```sh
# Deno
deno add jsr:@quarzo-life/fp

# npm
npx jsr add @quarzo-life/fp

# yarn
yarn dlx jsr add @quarzo-life/fp

# pnpm
pnpm dlx jsr add @quarzo-life/fp

# bun
bunx jsr add @quarzo-life/fp
```

## ⚡️ Quick start

Every function is pure and side-effect free, allowing you to bundle exactly what
you use.

```ts
import { error, pipe, type Result, success } from "jsr:@quarzo-life/fp";

const parse = (raw: string): Result<number, "NOT_A_NUMBER"> => {
  const n = Number(raw);
  return Number.isNaN(n) ? error("NOT_A_NUMBER") : success(n);
};

const double = (n: number) => n * 2;
const asString = (n: number) => `${n}`;

parse("21")
  .bind(pipe(double, asString, success))
  .fold(
    (s) => s,
    (e) => e,
  ); // "42"
```

## What's inside

| Group          | Exports                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Functions      | `identity`, `compose`, `composeAsync`, `pipe`, `curry`                                                                              |
| Arrays         | `head`, `last`, `map`, `filter` (data-last, curried)                                                                                |
| Objects        | `prop`, `omit`                                                                                                                      |
| Guards         | `isDefined`                                                                                                                         |
| Immutability   | `freeze`, `Immutable`, `ImmutableArray`, `ImmutableRecord`                                                                          |
| Either         | `some`, `none`, `cautiouslyUseIsSome`, `cautiouslyUseIsNone`, `getTestSome`                                                         |
| Result         | `success`, `successVoid`, `error`, `cautiouslyUseIsSuccess`, `cautiouslyUseIsError`, `getTestResult`, `getTestError`, `asyncResult` |
| Result errors  | `ResultError`, `DomainFailure`, `TransientTechnicalFailure`, `PermanentTechnicalFailure`, `isFailureKind`                           |
| Result context | `nextAsyncResult`, `withContext`, `wrap`, `unwrap`, `promiseWrap`, `promiseResultWrap`, `withContextAsyncResult`                    |

### Result

`Result<U, E>` is either a `Success<U>` or an `Error<E>`. Chain with `.bind()`
(runs on success, forwards errors), recover with `.bindError()`, and collapse
with `.fold()`. `asyncResult` gives the same fluent API over a
`Promise<Result>`:

```ts
import { asyncResult, success } from "jsr:@quarzo-life/fp";

const increment = (n: number) => Promise.resolve(success(n + 1));
const square = (n: number) => Promise.resolve(success(n ** 2));

await asyncResult(Promise.resolve(success(1)))
  .bind(increment)
  .bind(square)
  .get(); // Success<number> with value 4
```

Errors returned in a `Result` can extend `ResultError`, or one of its classified
flavours (`DomainFailure`, `TransientTechnicalFailure`,
`PermanentTechnicalFailure`) so callers can decide whether a retry makes sense
with `isFailureKind`.

### Either

`Either<U>` is an optional value: `some(value)` or `none()`. Same fluent API
(`.bind()`, `.bindNone()`, `.fold()`).

## License

[MIT](LICENSE)
