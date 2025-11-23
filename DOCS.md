# handy-ts-tools: usage guide

This guide walks through the library with small, runnable snippets. Everything is available from the single entrypoint `handy-ts-tools`; tree-shaking drops unused imports in bundlers. Namespaced imports (e.g., `Algorithms`, `IterableUtils`) are also available from the root.

## Assertions

Use lightweight assertions to fail fast and narrow types.

```ts
import { assert, assertDefined, assertNever } from "handy-ts-tools";

assert(user.isActive, "user must be active");
const id = assertDefined(user.id, "missing id");

type Status = "idle" | "running";
const status: Status = "idle";
switch (status) {
  case "idle":
  case "running":
    break;
  default:
    assertNever(status);
}
```

## Type guards

Runtime guards that narrow unknown data before you use it.

```ts
import {
  isString,
  isNumber,
  isInteger,
  isPositive,
  isBetween,
  isNonEmptyString,
  isUUID,
  isISODate,
  isISODateTime,
  isEven,
  isOdd,
  isGreaterThanZero,
  isPlainObject,
  isNonEmptyArray,
  isArray,
  isSet,
  isMap,
  isNonEmptySet,
  isNonEmptyMap,
  isOneOf,
  isTrue,
  isFalse,
  isSomething,
  isDiscriminatedUnionMember,
} from "handy-ts-tools";

if (isString(input)) {
  input.toUpperCase();
}

if (isPlainObject(payload)) {
  // payload is Record<string, unknown>
}

const count: unknown = 3;
if (isEven(count) && isGreaterThanZero(count)) {
  // count is a positive even number
}
const parityLabel = isOdd(count) ? "odd" : "even";

if (isSet(tags) && isNonEmptyArray(Array.from(tags))) {
  // non-empty set of tags
}

if (isOneOf(step, ["draft", "published"] as const)) {
  step satisfies "draft" | "published";
}

if (isPositive(score) && isBetween(score, 0, 100)) {
  // score is a number from 0..100
}

if (isNonEmptyString(title)) {
  // title is a non-empty string
}

if (isUUID(id)) {
  // string id is a UUID
}

if (isISODateTime(timestamp)) {
  // timestamp is a valid ISO date-time string with timezone
}

type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };
const isCircle = isDiscriminatedUnionMember<Shape, "kind", "circle">("kind", "circle");
if (isCircle(shape)) {
  shape.radius;
}
```

## Functional helpers

Tiny composable helpers for everyday functional patterns.

```ts
import { identity, noop, pipe, compose, once, memoize, clamp } from "handy-ts-tools";

const capped = clamp(value, 0, 100);

const result = pipe(
  "hello",
  (s) => s.toUpperCase(),
  (s) => `${s}!`,
); // "HELLO!"

const greet = once((name: string) => `hi, ${name}`);
greet("Ada"); // computes
greet("Grace"); // returns cached "hi, Ada"

const slow = (n: number) => n * 2;
const fast = memoize(slow);
fast(2); // computes
fast(2); // cache hit
```

## Iterable helpers

Utilities for synchronous iterables (arrays, Sets, Maps keys/values, generators).

```ts
import {
  toArray,
  mapIterable,
  filterIterable,
  take,
  drop,
  flatMapIterable,
  reduceIterable,
  chunk,
  groupBy,
  partition,
  toSet,
  toMap,
  zip,
} from "handy-ts-tools";

const numbers = [1, 2, 3, 4, 5];
toArray(take(numbers, 3)); // [1, 2, 3]
toArray(filterIterable(numbers, (n) => n % 2 === 0)); // [2, 4]

toArray(
  flatMapIterable(["a", "b"], (ch) => [ch, ch.toUpperCase()]),
); // ["a", "A", "b", "B"]

chunk(numbers, 2); // [[1,2],[3,4],[5]]
groupBy(numbers, (n) => (n % 2 === 0 ? "even" : "odd")); // Map { "odd" => [1,3,5], "even" => [2,4] }
partition(numbers, (n) => n % 2 === 0); // [[2,4], [1,3,5]]
toSet(numbers); // Set {1,2,3,4,5}
toMap(numbers, { key: (n) => `#${n}`, value: (n) => n * 10 }); // Map { "#1" => 10, ... }
toArray(zip([1, 2], ["a", "b"])); // [[1, "a"], [2, "b"]]
```

## Async iterable helpers

Work with streaming async data the same way you do with sync iterables.

```ts
import { toArrayAsync, mapAsyncIterable, filterAsyncIterable, takeAsync, reduceAsyncIterable } from "handy-ts-tools";

async function example(stream: AsyncIterable<number>) {
  const firstTwo = await toArrayAsync(takeAsync(stream, 2));
  const doubled = mapAsyncIterable(stream, (n) => n * 2);
  const evens = filterAsyncIterable(stream, (n) => n % 2 === 0);
  const sum = await reduceAsyncIterable(stream, (acc, n) => acc + n, 0);
}
```

## Object helpers

Safe object transforms: projections, deep access, and builders.

```ts
import { pick, omit, merge, deepGet, deepSet, ensureSet, ensureMap } from "handy-ts-tools";

pick({ a: 1, b: 2 }, ["a"]); // { a: 1 }
omit({ a: 1, b: 2 }, ["b"]); // { a: 1 }
merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }

const cfg = { server: { host: "localhost" } };
deepGet(cfg, ["server", "host"]); // "localhost"
deepSet(cfg, ["server", "port"], 3000); // mutates cfg.server.port = 3000

ensureSet([1, 2, 2]); // Set {1,2}
ensureMap([
  ["a", 1],
  ["b", 2],
]); // Map { "a" => 1, "b" => 2 }
```

## String helpers

Small text utilities for common formatting tasks.

```ts
import { ensurePrefix, ensureSuffix, capitalize, truncate, camelCase, kebabCase, snakeCase, titleCase } from "handy-ts-tools";

ensurePrefix("world", "hello "); // "hello world"
ensureSuffix("file", ".txt"); // "file.txt"
capitalize("hello"); // "Hello"
truncate("abcdefgh", 5); // "ab..."
camelCase("handy_ts-tools"); // "handyTsTools"
kebabCase("HelloWorld"); // "hello-world"
snakeCase("HelloWorld"); // "hello_world"
titleCase("hello_world"); // "Hello World"
```

## Number helpers

Numerical helpers for ranges, rounding, percentages, and simple predicates.

```ts
import {
  roundTo,
  inRange,
  toPercent,
  isEven,
  isOdd,
  isGreaterThanZero,
  isPositive,
  isNegative,
  isBetween,
  isMultipleOf,
  isInteger,
} from "handy-ts-tools";

roundTo(3.14159, 2); // 3.14
inRange(5, 1, 10); // true
toPercent(1, 4); // 25
isEven(10); // true
isOdd(7); // true
isGreaterThanZero(-5); // false
isPositive(42); // true
isNegative(-1); // true
isBetween(5, 0, 10); // true
isInteger(3.1); // false
isMultipleOf(12, 3); // true
```

## Promise helpers

Deferred creation for wiring external resolve/reject.

```ts
import { createDeferred } from "handy-ts-tools";

const { promise, resolve, reject } = createDeferred<number>();
setTimeout(() => resolve(42), 100);
const answer = await promise; // 42
```

## Error helpers

Normalize errors and add retries/wrappers with consistent messages.

```ts
import { isErrorLike, wrapError, retry } from "handy-ts-tools";

try {
  throw new Error("boom");
} catch (err) {
  if (isErrorLike(err)) {
    console.error(err.message);
  }
}

const load = wrapError(async (id: string) => fetch(`/api/${id}`), "Load failed");
const result = await load("123"); // errors get prefixed

await retry(
  async () => {
    // your async work here
  },
  { retries: 3, delayMs: 100, shouldRetry: (err, attempt) => attempt < 3 },
);
```

## Enum helpers

Parse loose input into enum values safely.

```ts
import { parseEnumValue } from "handy-ts-tools";

enum Role {
  User = "user",
  Admin = "admin",
}

parseEnumValue(Role, "admin"); // "admin"
parseEnumValue(Role, "guest"); // undefined
```

## Algorithms

Grab bag of classic algorithms and data structures.

```ts
import {
  binarySearch,
  uniqueBy,
  topologicalSort,
  bfs,
  dfs,
  quickSelect,
  mergeSort,
  kSmallest,
  bubbleSort,
  summarize,
  traverseTree,
  dijkstra,
  combinations,
  permutations,
  PriorityQueue,
  UnionFind,
} from "handy-ts-tools";

binarySearch([1, 3, 5, 7], 5); // 2
uniqueBy(
  [
    { id: 1, name: "a" },
    { id: 1, name: "b" },
  ],
  (item) => item.id,
); // [{ id:1, name:"a" }]

topologicalSort(
  [
    ["a", "b"],
    ["b", "c"],
  ],
  (node) => node,
  (edge) => edge[0],
  (edge) => edge[1],
); // ["a","b","c"]

const pq = new PriorityQueue<number>((a, b) => a - b);
pq.push(3);
pq.push(1);
pq.pop(); // 1

const uf = new UnionFind(3);
uf.union(0, 1);
uf.connected(0, 1); // true

mergeSort([3, 1, 2]); // [1,2,3]
bubbleSort([5, 4, 3]); // [3,4,5]
quickSelect([9, 1, 5, 2], 2); // 5 (0-based order statistic)
kSmallest([9, 1, 5, 2], 2); // [1,2]

bfs(
  { a: ["b", "c"], b: ["d"], c: [], d: [] },
  "a",
  (node) => console.log(node),
);

dfs(
  { a: ["b", "c"], b: ["d"], c: [], d: [] },
  "a",
  (node) => console.log(node),
);

summarize([1, 1, 2, 3]); // Map {1 => 2, 2 => 1, 3 => 1}

traverseTree(
  { value: 1, children: [{ value: 2 }, { value: 3 }] },
  (node) => node.children ?? [],
  (node) => node.value,
); // [1,2,3] preorder

combinations([1, 2, 3], 2); // [[1,2],[1,3],[2,3]]
permutations([1, 2, 3]); // all orderings
```

## Types

Pure TypeScript utilities to shape and constrain your types.

```ts
import type {
  ValueOf,
  RequireAtLeastOne,
  DeepReadonly,
  Exact,
  UnionToIntersection,
  Nullish,
  Maybe,
  Falsy,
  Truthy,
  NonEmptyArray,
  ReadonlyRecord,
  Mutable,
  Writable,
  DeepPartial,
  NonEmptySet,
  NonEmptyMap,
  DeepRequired,
  Opaque,
} from "handy-ts-tools";

type User = { id: string; role?: string };
type UserId = ValueOf<User, "id">; // string
type RequiredIdOrRole = RequireAtLeastOne<User, "id" | "role">;
type ReadonlyUser = DeepReadonly<User>;
type OnlyExactUser = Exact<User, { id: string; role?: string }>; // narrows excess props
type StrictIntersection = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a:1 } & { b:2 }
type AllRequired = DeepRequired<{ a?: { b?: number } }>; // { a: { b: number } }
type Writable = Mutable<Readonly<User>>; // removes readonly
type AlsoWritable = Writable<Readonly<User>>; // alias for the same intent
type ReadonlySettings = ReadonlyRecord<"host" | "port", string>; // readonly keys/values
type PartiallyOptional = DeepPartial<User>; // partial recursively
type TaggedId = Opaque<string, "UserId">; // nominal brand
type NullableId = Nullish<string>; // string | null | undefined

type MaybeUser = Maybe<User>; // User | null | undefined
type NonEmpty = NonEmptyArray<number>; // [number, ...number[]]
type NonEmptyUserIds = NonEmptySet<string>;
type NonEmptyDictionary = NonEmptyMap<string, number>;
type FalsyValue = Falsy; // inferred union of falsy values
type TruthyValue<T> = Truthy<T>; // removes falsy cases from T

// Runtime brand helper pairs well with Opaque
import { createBrand } from "handy-ts-tools";
const { brand, isBrand } = createBrand<"OrderId">();
const brandedOrderId = brand("123");
isBrand(brandedOrderId); // true
isBrand("123"); // false (primitives are boxed when branded, so only that boxed value passes)
```

## Namespaced imports

Everything is exported from the root, but if you prefer grouping by domain you can use namespace imports:

```ts
import {
  Asserts,
  TypeGuards,
  Functional,
  IterableUtils,
  AsyncIterableUtils,
  ObjectUtils,
  StringUtils,
  NumberUtils,
  PromiseUtils,
  ErrorUtils,
  EnumUtils,
  Algorithms,
  Types,
} from "handy-ts-tools";

Asserts.assert(true);
TypeGuards.isPlainObject({});
Functional.pipe(1, (x) => x + 1);
const taken = IterableUtils.toArray(IterableUtils.take([1, 2, 3], 2));
const doubled = await AsyncIterableUtils.toArrayAsync(
  AsyncIterableUtils.mapAsyncIterable([1, 2], (v) => v * 2),
);
const merged = ObjectUtils.merge({ a: 1 }, { b: 2 });
const cased = StringUtils.camelCase("hello-world");
const rounded = NumberUtils.roundTo(3.14159, 2);
const deferred = PromiseUtils.createDeferred<number>();
const wrapped = ErrorUtils.wrapError(() => { throw new Error("x"); }, "msg");
const parsed = EnumUtils.parseEnumValue({ A: "a" }, "a");
const sorted = Algorithms.mergeSort([3, 1, 2], (a, b) => a - b);
type ExactUser = Types.Exact<{ id: string }, { id: string }>;
```
