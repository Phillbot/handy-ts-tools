# handy-ts-tools

Small TypeScript-first toolkit with no runtime dependencies. Everything is grouped
by intent so it is easy to tree-shake only what you need:

- **typeguards** — runtime guards for narrowing values (`isObject` and `isPlainObject` both exclude arrays; use `isArray` helpers instead);
- **asserts** — lightweight assertions and custom error types;
- **helpers** — utility functions split by domain (`functional`, `iterable`, `asyncIterable`, `object`, `string`, `number`, `promise`, `error`, `enum`, `algorithms`);
- **types** — pure TypeScript helpers like `ValueOf`, `RequireAtLeastOne`, and `DeepReadonly`.

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
import type { RequireAtLeastOne } from "handy-ts-tools/types";

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

## Available helpers

| Category | Functions |
| --- | --- |
| `typeguards` | `isDefined`, `isString`, `isNumber`, `isPlainObject`, `isObject`, `isEmptyObject`, `isArray`, `isEmptyArray`, `isNonEmptyArray`, `isSet`, `isEmptySet`, `isMap`, `isEmptyMap`, `isOneOf`, `isTrue`, `isFalse`, `isNothing`, `isSomething`, `isNull`, `isUndefined`, `isDiscriminatedUnionMember` |
| `asserts` | `AssertionError`, `assert`, `assertDefined`, `assertNever` |
| `functional` | `identity`, `noop`, `pipe`, `compose`, `clamp`, `once`, `memoize` |
| `object` | `pick`, `ensureSet`, `ensureMap`, `omit`, `merge`, `deepGet`, `deepSet` |
| `promise` | `createDeferred` |
| `iterable` | `toArray`, `mapIterable`, `filterIterable`, `take`, `drop`, `flatMapIterable`, `reduceIterable`, `toSet`, `toMap`, `chunk`, `groupBy`, `partition`, `zip` |
| `async iterable` | `toArrayAsync`, `mapAsyncIterable`, `filterAsyncIterable`, `takeAsync`, `reduceAsyncIterable` |
| `string` | `ensurePrefix`, `ensureSuffix`, `capitalize`, `truncate`, `camelCase`, `kebabCase`, `snakeCase`, `titleCase` |
| `number` | `roundTo`, `inRange`, `toPercent` |
| `error` | `isErrorLike`, `wrapError`, `retry` |
| `enum` | `parseEnumValue` |
| `types` | `ValueOf`, `RequireAtLeastOne`, `DeepReadonly`, `Exact`, `UnionToIntersection`, `Nullish`, `Maybe<T>`, `Falsy`, `Truthy<T>`, `NonEmptyArray<T>`, `Mutable<T>`, `DeepRequired<T>` |
| `helpers/algorithms` | `binarySearch`, `uniqueBy`, `topologicalSort`, `bfs`, `dfs`, `quickSelect`, `mergeSort`, `kSmallest`, `bubbleSort`, `summarize`, `traverseTree`, `PriorityQueue`, `UnionFind`, `dijkstra`, `combinations`, `permutations` |

## Development

```bash
pnpm install       # install dependencies
pnpm run build     # emit dist/ artifacts
pnpm test          # run Vitest suite
```

Build uses `tsc`; tests are handled by Vitest. `pnpm` is the default package manager for this repo, but `npm`/`yarn` work too.

### Imports

Single entrypoint (all helpers, guards, and types):

```ts
import { assert, assertNever, ensurePrefix, isDiscriminatedUnionMember } from "handy-ts-tools";
```

## Changelog & License

- See [CHANGELOG.md](./CHANGELOG.md) for release notes; update the date before publishing a new version.
- Distributed under the [MIT](./LICENSE) license.

## Full usage guide

Looking for concrete examples for every helper, guard, and type? See [DOCS.md](./DOCS.md) for a full walkthrough.
