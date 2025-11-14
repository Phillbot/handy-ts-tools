# Changelog

All notable changes to this project will be documented here.

## [1.0.1] - 2025-11-15

- Re-publish under the scoped package name `@phillbot/ts-kit`.

## [1.0.0] - 2025-11-15

- Initial public release of `ts-kit`.
- Includes runtime helpers (asserts, typeguards, iterable/string/number/promise/object/error/enum utilities).
- Adds async iterable support, enum parsing, retry/wrapError helpers, and pnpm-based tooling.
- Provides TypeScript-only helpers such as `ValueOf`, `RequireAtLeastOne`, `DeepReadonly`, `Exact`, `UnionToIntersection`.
- Vitest test suite covers all runtime helpers; build powered by `tsc`.

> Replace the date above when cutting the release.
