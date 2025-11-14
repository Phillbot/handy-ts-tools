# ts-kit

Small TypeScript-first toolkit with no runtime dependencies. Everything is grouped
by intent so it is easy to tree-shake only what you need:

- **typeguards** — runtime guards for narrowing values;
- **asserts** — lightweight assertions and custom error types;
- **helpers** — utility functions split by domain (`core`, `iterable`, `asyncIterable`, `object`, `string`, `number`, `promise`, `error`, `enum`);
- **types** — pure TypeScript helpers like `ValueOf`, `RequireAtLeastOne`, and `DeepReadonly`.

## Usage

```ts
import {
  assertDefined,
  ensureSuffix,
  isNonEmptyArray,
  mapAsyncIterable,
  pipe,
  take,
  toArray,
  toArrayAsync,
  toPercent,
} from "@phillbot/ts-kit";

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
import type { RequireAtLeastOne } from "@phillbot/ts-kit";

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
| `typeguards` | `isDefined`, `isString`, `isNumber`, `isPlainObject`, `isNonEmptyArray`, `isOneOf`, `isDiscriminatedUnionMember` |
| `asserts` | `AssertionError`, `assert`, `assertDefined`, `assertNever` |
| `helpers/core` | `identity`, `noop`, `pipe`, `clamp` |
| `helpers/object` | `pick` |
| `helpers/promise` | `createDeferred` |
| `helpers/iterable` | `toArray`, `mapIterable`, `filterIterable`, `take`, `drop`, `flatMapIterable`, `reduceIterable` |
| `helpers/asyncIterable` | `toArrayAsync`, `mapAsyncIterable`, `filterAsyncIterable`, `takeAsync`, `reduceAsyncIterable` |
| `helpers/string` | `ensurePrefix`, `ensureSuffix`, `capitalize`, `truncate` |
| `helpers/number` | `roundTo`, `inRange`, `toPercent` |
| `helpers/error` | `isErrorLike`, `wrapError`, `retry` |
| `helpers/enum` | `parseEnumValue` |
| `types` | `ValueOf`, `RequireAtLeastOne`, `DeepReadonly`, `Exact`, `UnionToIntersection` |

## Development

```bash
pnpm install       # install dependencies
pnpm run build     # emit dist/ artifacts
pnpm test          # run Vitest suite
```

Build uses `tsc`; tests are handled by Vitest. `pnpm` — менеджер по умолчанию, но `npm`/`yarn` тоже подойдут.

## Changelog & License

- Все изменения фиксируются в [CHANGELOG.md](./CHANGELOG.md). Перед релизом обнови дату и записи.
- Проект распространяется по лицензии [MIT](./LICENSE).
