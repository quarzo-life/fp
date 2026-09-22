<p align="center">
  <h1>fp</h1>
</p>

<p align="center">
  <strong>Functional programming helpers for JavaScript and TypeScript.</strong>
</p>

<p align="center">
  A lightweight, dependency-free collection of pure functions. Sibling project
  to <a href="https://github.com/quarzo-life/moneta">Moneta</a> and
  <a href="https://github.com/quarzo-life/portio">Portio</a>.
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
import { identity } from "jsr:@quarzo-life/fp";

identity(42); // 42
[1, 2, 3].map(identity); // [1, 2, 3]
```

## Scope

This is the initial scaffold of the library. It currently exposes `identity`;
composition helpers (`pipe`, `compose`, `curry`), data accessors and
`Result`/`Either` types will follow.

## Links

- [Moneta](https://github.com/quarzo-life/moneta)
- [Portio](https://github.com/quarzo-life/portio)

## License

[MIT](LICENSE)
