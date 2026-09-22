# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project

`@quarzo-life/fp` - a Deno/JSR library of functional programming helpers: pure,
side-effect free functions with no runtime dependencies. Sibling project to
[`@quarzo-life/moneta`](https://github.com/quarzo-life/moneta) and
[`@quarzo-life/portio`](https://github.com/quarzo-life/portio), and follows the
same conventions. Distributed via JSR; consumers can also pull it through
npm/yarn/pnpm/bun via the `jsr add` shim.

The code was extracted from the monorepo's `packages/shared/fp-utils` package
(`@quarzo-life/fp-utils`). The public API is kept source-compatible with it,
except: `unboundMethod` was dropped (`map`/`filter` are now implemented
directly), `Either.bindNone` is a no-op on `Some` (it used to discard the
value), and helper types that were private are now exported (required by
`deno doc --lint`).

## Commands

The runtime is Deno, but **tests run under vitest**, not Deno's native runner
(`deno.jsonc` excludes `src/**/*.test.ts` from `deno test` discovery):

- `deno task test` - run the vitest suite once.
- `deno task test:watch` - vitest in watch mode.
- `deno task test src/api/functions/__tests__/pipe.test.ts` - a single file.
- `deno lint` / `deno fmt` - lint and format (lint uses the `recommended`
  ruleset).
- `deno check mod.ts 'src/**/*.ts'` - type-check the entrypoint _and_ the tests
  (vitest does not type-check).
- `deno doc --lint mod.ts` - must stay clean: every exported symbol (including
  class members and each function overload) needs JSDoc, explicit return types,
  and no references to private types.
- `deno publish --dry-run --allow-dirty` - verify the package is JSR-publishable
  (runs the slow-types check).

Publishing to JSR happens automatically via `.github/workflows/publish.yml` on
push to `main`: a `test` job runs fmt/lint/check/doc-lint/vitest and a publish
dry run, and the `publish` job (`npx jsr publish`) only runs if it passes. Bump
`version` in `deno.jsonc` before merging a release. The workflow only triggers
on `main`, so run the same commands locally before pushing a branch.

## Import paths

`deno.jsonc` defines an import map with two aliases, both backed by real files:

- `mod.ts` imports via the alias: `export * from "api/index.ts";`
- Files inside `src/api/` import each other with **relative paths** (e.g.
  `import { success } from "../success.ts";`).

Adding a new top-level folder under `src/` requires registering it in
`deno.jsonc` _and_ exporting it from `mod.ts` if it should be public.

## Architecture

### Public API surface (`src/api/`)

Functions are pure, **one file per exported function or class**, named in
kebab-case after the symbol (`is-defined.ts` → `isDefined`). Shared types of a
group live in that group's `types.ts`. Groups:

- `functions/` - `compose`, `composeAsync`, `pipe`, `curry`; `types.ts` holds
  the `AnyFunction`/`AnyAsyncFunction` escape hatches (the only `any` in the
  codebase, file-level lint-ignored).
- `arrays/` - `head`, `last`, `map`, `filter`.
- `objects/` - `prop`, `omit`.
- `guards/` - `isDefined`.
- `identity-functor/` - `identityFunctor`.
- `immutability/` - `freeze` (shallow; blocks `Map`/`Set` mutators).
- `either/` - `Either` = `Some | None`, constructors `some`/`none`, guards,
  `getTestSome`.
- `result/` - `Result` = `Success | Error`, constructors `success`,
  `successVoid`, `error`, guards, `getTestResult`/`getTestError`, `asyncResult`
  (fluent chain over `Promise<Result>`).
  - `result/errors/` - `ResultError` base class (does **not** extend the global
    `Error`) and the `FailureKind`-classified subclasses `DomainFailure`,
    `TransientTechnicalFailure`, `PermanentTechnicalFailure`, plus
    `isFailureKind`.
  - `result/with-context/` - `WithContext` value/context pairs travelling
    through an async chain: `wrap`, `promiseWrap`, `promiseResultWrap`,
    `unwrap`, `withContext`, `withContextAsyncResult`, and `nextAsyncResult`
    (the context-aware counterpart of `asyncResult`).

Everything is re-exported through per-folder `index.ts` barrels, then
`src/api/index.ts`, then `mod.ts`. Barrels use named exports; the `type` keyword
marks type-only exports.

Cross-cutting patterns to preserve when adding API:

- **No runtime dependencies.** Only dev dependencies (vitest) are allowed.
- **Monads are plain objects with methods**, not classes: `some`/`none`/
  `success`/`error` return object literals whose `bind`/`fold`/… close over the
  value. Error short-circuits `bind`; success short-circuits `bindError`.
- **Data-last, curried where it helps composition.** `map(fn, array)` and
  `map(fn)(array)` both work (implemented with a rest tuple `[] | [T[]]`, not
  `arguments`). `prop`, `omit`, `wrap` follow suit.
- **`Error` (the Result type) shadows the global `Error`.** Import it as
  `type Error` and alias it if a file also needs the global.
- **The `cautiouslyUse*` guards and `getTest*` unwrappers are escape hatches**:
  prefer `.bind()`/`.fold()` in library code; `getTest*` are for tests.
- **Every exported symbol carries JSDoc with `@example`.** Description first
  (behavioral notes, curried usage, no-op cases), then
  `@typeParam`/`@param`/`@returns`, then fenced ```ts examples importing from
  `@quarzo-life/fp`, with a trailing comment showing the result. Overloaded
  functions need a JSDoc block per overload signature. Take example values from
  the tests so they are demonstrably correct.

## Tests

Tests live next to the code in `__tests__/` directories, file names
`<feature>.test.ts`, using vitest's `describe`/`test`/`expect`/`vi` (imported
from `"vitest"`). Group cases with nested `describe` blocks when a function has
several modes (curried vs. uncurried, `Some` vs. `None`). Cover edge inputs:
empty arrays, `null`/`undefined`, error short-circuiting, and the no-op branches
of `bindError`/`bindNone`. Tests are type-checked by `deno check 'src/**/*.ts'`:
when a `Result` starts as `error(...)`, annotate it
(`const r: Result<number, string> = error("KO")`) since `Error<E>` alone has a
`never` success type.
