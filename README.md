# handy-ts-tools

Small TypeScript-first toolkit with no runtime dependencies. All helpers, guards, and types are exported from the single entrypoint `handy-ts-tools`. Categories are for orientation only (functional, iterable/async-iterable, object, string, number, promise, error, enum, algorithms, typeguards, asserts, and type utilities like `ValueOf`, `RequireAtLeastOne`, `DeepReadonly`).

## Usage

```ts
import {
  assertDefined,
  ensureSuffix,
  pipe,
  toPercent,
  isNonEmptyArray,
  mapAsyncIterable,
  take,
  toArray,
  toArrayAsync,
} from "handy-ts-tools";

const payload = assertDefined(maybeValue, "payload must be loaded");
const completedPercent = toPercent(payload.completed, payload.total);
const listTitle = ensureSuffix(payload.name, ":");

if (isNonEmptyArray(payload.items)) {
  const firstThree = toArray(take(payload.items, 3));
  console.log(listTitle, firstThree);
}

const asyncStream = mapAsyncIterable(payload.asyncItems, (item) => ({ ...item, hydrated: true }));
const buffered = await toArrayAsync(asyncStream);
console.log("ready", buffered, completedPercent);
```

### Type helper example

```ts
import type { RequireAtLeastOne } from "handy-ts-tools";

type FetchOptions = RequireAtLeastOne<
  {
    userId?: string;
    email?: string;
    phone?: string;
  },
  "userId" | "email" | "phone"
>;

// ✅ at least one identifier is required
const request: FetchOptions = { email: "user@example.com" };
```

## What's inside

All exports come from the root entrypoint. The library includes:
- Runtime guards (`isDefined`, `isPlainObject`, `isDiscriminatedUnionMember`, etc.) and lightweight asserts.
- Functional/iterable helpers (sync and async), string/number/object/promise/error/enum utilities.
- Algorithms (search/sort/graph, priority queue, union-find, combinations/permutations).
- Type-level helpers (`ValueOf`, `RequireAtLeastOne`, `DeepReadonly`, `Exact`, `UnionToIntersection`, `DeepRequired`, `ReadonlyRecord`, `DeepPartial`, `Opaque`, etc.).

## Development

```bash
pnpm install       # install dependencies
pnpm run build     # emit dist/ artifacts
pnpm test          # run Vitest suite
pnpm run test:types # run type checks with tsd (after build)
pnpm run test:all   # run both Vitest and tsd
```

Build uses `tsc`; tests are handled by Vitest and tsd. `pnpm` is the default package manager for this repo, but `npm`/`yarn` work too.

### Imports

Single entrypoint (all helpers, guards, algorithms, and types):

```ts
import {
  assert,
  assertNever,
  ensurePrefix,
  isDiscriminatedUnionMember,
  pipe,
  toArray,
  mapAsyncIterable,
  binarySearch,
  ValueOf,
} from "handy-ts-tools";
```

Namespaced imports are also exposed for grouping by domain:

```ts
import { Asserts, TypeGuards, Algorithms, IterableUtils, AsyncIterableUtils } from "handy-ts-tools";

Asserts.assert(true);
TypeGuards.isPlainObject(value);
const found = Algorithms.binarySearch([1, 3, 5], 3, (a, b) => a - b);
const firstTwo = IterableUtils.toArray(IterableUtils.take([1, 2, 3], 2));
const doubled = await AsyncIterableUtils.toArrayAsync(
  AsyncIterableUtils.mapAsyncIterable([1, 2], (v) => v * 2),
);
```

## Changelog & License

- See [CHANGELOG.md](./CHANGELOG.md) for release notes; update the date before publishing a new version.
- Distributed under the [MIT](./LICENSE) license.

## Full usage guide

Looking for concrete examples for every helper, guard, and type? See [DOCS.md](./DOCS.md) for a full walkthrough.

## AI notice

Changes in this repository include AI-assisted code, tests, and documentation. See [AI_NOTICE.md](./AI_NOTICE.md).
