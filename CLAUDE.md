# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project

`@quarzo-life/fp` — a Deno/JSR library of functional programming helpers: pure,
side-effect free functions with no runtime dependencies. Sibling project to
[`@quarzo-life/moneta`](https://github.com/quarzo-life/moneta) and
[`@quarzo-life/portio`](https://github.com/quarzo-life/portio), and follows the
same conventions. Distributed via JSR; consumers can also pull it through
npm/yarn/pnpm/bun via the `jsr add` shim.

## Commands

The runtime is Deno, but **tests run under vitest**, not Deno's native runner
(`deno.jsonc` excludes `src/**/*.test.ts` from `deno test` discovery):

- `deno task test` — run the vitest suite once.
- `deno task test:watch` — vitest in watch mode.
- `deno task test src/api/__tests__/identity.test.ts` — a single file.
- `deno lint` / `deno fmt` — lint and format (lint uses the `recommended`
  ruleset).
- `deno check mod.ts` — type-check the public entrypoint.
- `deno doc --lint mod.ts` — must stay clean: every exported symbol needs JSDoc,
  explicit return types, and no references to private types.
- `deno publish --dry-run` — verify the package is JSR-publishable.

Publishing to JSR happens automatically via `.github/workflows/publish.yml` on
push to `main` (`npx jsr publish`). Bump `version` in `deno.jsonc` before
merging a release. There is no CI workflow yet — run lint/fmt/check/test locally
before pushing.

## Import paths

`deno.jsonc` defines an import map with two aliases, both backed by real files:

- `mod.ts` imports via the alias: `export * from "api/index.ts";`
- Files inside `src/api/` import each other with **relative paths** (e.g.
  `import { identity } from "../identity.ts";`).

Adding a new top-level folder under `src/` requires registering it in
`deno.jsonc` _and_ exporting it from `mod.ts` if it should be public.

## Architecture

### Public API surface (`src/api/`)

Functions are pure, **one file per function**, named in kebab-case after the
exported symbol (`identity.ts` → `identity`). Related functions can be grouped
in sub-folders with their own `index.ts` barrel.

Everything is re-exported through per-folder `index.ts` barrels, then
`src/api/index.ts`, then `mod.ts`.

Cross-cutting patterns to preserve when adding API:

- **No runtime dependencies.** The library must stay dependency-free; only dev
  dependencies (vitest) are allowed.
- **Data-last, curried where it helps composition.** Prefer signatures that take
  configuration first and the data last, so they slot into `pipe`.
- **Every exported symbol carries JSDoc with `@example`.** Description first
  (behavioral notes, curried usage, throw conditions), then
  `@typeParam`/`@param`/`@returns`, then fenced ```ts examples importing from
  `@quarzo-life/fp`, with a trailing comment showing the result. Take example
  values from the tests so they are demonstrably correct.
  `deno doc --lint mod.ts` enforces coverage.

## Tests

Tests live next to the code in `__tests__/` directories, file names
`<feature>.test.ts`, using vitest's `describe`/`test`/`expect` (imported from
`"vitest"`). Group cases with nested `describe` blocks when a function has
several modes (e.g. curried vs. uncurried call). Cover edge inputs: empty
arrays, `null`/`undefined`, and identity/neutral cases.
