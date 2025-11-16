# Changelog

All notable changes to this project will be documented here.

## [1.3.1] - 2025-11-16

- Document existing namespace exports (`Algorithms`, `IterableUtils`, `Asserts`, etc.) and root-only imports in README/DOCS; add full usage guide.
- Expand runtime test coverage (iterable/async iterable/object/string/number/error/algorithms) and add type-level tests with `tsd` plus combined `test:all` script.
- Fix `Exact` type to enforce symmetric matching.

## [1.3.0] - 2025-11-16

- Switch package to a single root entrypoint (`handy-ts-tools`) and drop subpath exports.
- Export map now points directly to `dist/index.js`/`dist/index.d.ts` for editor auto-imports.
- Tighten typings for functional/object/error helpers (no more `any` holes in `pipe`, `compose`, `once`, `memoize`, `wrapError`, `merge`, `deepGet`, `deepSet`).
- All tests pass under Vitest.
- Add `DOCS.md` with end-to-end usage examples for all helpers.

## [1.2.1] - 2025-11-15

- Fix license metadata (name/date).

## [1.2.0] - 2025-11-15

- Add subpath type mappings in `exports` to improve selective imports.

## [1.1.0] - 2025-11-15

- Expose subpath entries in `exports` for selective imports.

## [1.0.3] - 2025-11-15

- Rename npm package to `handy-ts-tools` to avoid scope requirement.

## [1.0.1] - 2025-11-15

- Re-publish under the scoped package name `@phillbot/ts-kit`.

## [1.0.0] - 2025-11-15

- Initial public release of `ts-kit`.
- Includes runtime helpers (asserts, typeguards, iterable/string/number/promise/object/error/enum utilities).
- Adds async iterable support, enum parsing, retry/wrapError helpers, and pnpm-based tooling.
- Provides TypeScript-only helpers such as `ValueOf`, `RequireAtLeastOne`, `DeepReadonly`, `Exact`, `UnionToIntersection`.
- Vitest test suite covers all runtime helpers; build powered by `tsc`.

> Replace the date above when cutting the release.
