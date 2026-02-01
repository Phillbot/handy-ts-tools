/**
 * Helpers for working with Iterable values.
 */

/**
 * Converts an iterable into an array. Arrays are returned as shallow copies.
 * 
 * @example
 * toArray(new Set([1, 2])) // [1, 2]
 */
export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.isArray(iterable) ? iterable.slice() : Array.from(iterable);
}

/**
 * Applies the mapper to each value as the iterable is consumed.
 * 
 * @example
 * mapIterable([1, 2], (x) => x * 2) // IterableIterator<2, 4>
 */
export function mapIterable<T, R>(iterable: Iterable<T>, mapper: (value: T, index: number) => R): IterableIterator<R> {
  return (function* () {
    let index = 0;
    for (const value of iterable) {
      yield mapper(value, index++);
    }
  })();
}

/**
 * Lazily filters iterable values by predicate.
 * 
 * @example
 * filterIterable([1, 2, 3], (x) => x > 1) // IterableIterator<2, 3>
 */
export function filterIterable<T>(
  iterable: Iterable<T>,
  predicate: (value: T, index: number) => boolean,
): IterableIterator<T> {
  return (function* () {
    let index = 0;
    for (const value of iterable) {
      if (predicate(value, index++)) {
        yield value;
      }
    }
  })();
}

/**
 * Takes the first `count` elements from an iterable.
 * 
 * @example
 * take([1, 2, 3], 2) // IterableIterator<1, 2>
 */
export function take<T>(iterable: Iterable<T>, count: number): IterableIterator<T> {
  if (count < 0) {
    throw new RangeError("take: count must be >= 0");
  }

  return (function* () {
    let yielded = 0;
    if (count === 0) {
      return;
    }
    for (const value of iterable) {
      yield value;
      if (++yielded >= count) {
        break;
      }
    }
  })();
}

/**
 * Skips the first `count` elements and yields the rest.
 * 
 * @example
 * drop([1, 2, 3], 1) // IterableIterator<2, 3>
 */
export function drop<T>(iterable: Iterable<T>, count: number): IterableIterator<T> {
  if (count < 0) {
    throw new RangeError("drop: count must be >= 0");
  }

  return (function* () {
    let skipped = 0;
    for (const value of iterable) {
      if (skipped < count) {
        skipped += 1;
        continue;
      }
      yield value;
    }
  })();
}

/**
 * Flat maps iterable items using mapper that can return an iterable or a single value.
 * 
 * @example
 * flatMapIterable([1, 2], (x) => [x, x]) // IterableIterator<1, 1, 2, 2>
 */
export function flatMapIterable<T, R>(
  iterable: Iterable<T>,
  mapper: (value: T, index: number) => Iterable<R> | R,
): IterableIterator<R> {
  return (function* () {
    let index = 0;
    for (const value of iterable) {
      const mapped = mapper(value, index++);
      if (isIterable(mapped)) {
        yield* mapped;
      } else {
        yield mapped;
      }
    }
  })();
}

/**
 * Reduces iterable values into a single accumulator.
 * 
 * @example
 * reduceIterable([1, 2, 3], (acc, x) => acc + x, 0) // 6
 */
export function reduceIterable<T, R>(
  iterable: Iterable<T>,
  reducer: (acc: R, value: T, index: number) => R,
  initialValue: R,
): R {
  let acc = initialValue;
  let index = 0;
  for (const value of iterable) {
    acc = reducer(acc, value, index++);
  }
  return acc;
}

/**
 * Builds a Set from iterable optionally applying mapper for each value.
 * 
 * @example
 * toSet([1, 1, 2]) // Set { 1, 2 }
 */
export function toSet<T, R = T>(iterable: Iterable<T>, mapper?: (value: T) => R): Set<R> {
  const result = new Set<R>();
  for (const value of iterable) {
    result.add(mapper ? mapper(value) : ((value as unknown) as R));
  }
  return result;
}

/**
 * Creates a Map from iterable using selector functions for key/value.
 * 
 * @example
 * toMap([1, 2], { key: (x) => x, value: (x) => x * 10 }) // Map { 1 => 10, 2 => 20 }
 */
export function toMap<T, K, V>(
  iterable: Iterable<T>,
  selectors: { key: (value: T) => K; value: (value: T) => V },
): Map<K, V> {
  const map = new Map<K, V>();
  for (const item of iterable) {
    map.set(selectors.key(item), selectors.value(item));
  }
  return map;
}

/**
 * Splits an iterable into equally-sized chunks (last chunk may be shorter).
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // IterableIterator<[1, 2], [3, 4], [5]>
 */
export function chunk<T>(iterable: Iterable<T>, size: number): IterableIterator<T[]> {
  if (size <= 0) {
    throw new RangeError("chunk: size must be > 0");
  }
  return (function* () {
    let current: T[] = [];
    for (const value of iterable) {
      current.push(value);
      if (current.length === size) {
        yield current;
        current = [];
      }
    }
    if (current.length > 0) {
      yield current;
    }
  })();
}

/**
 * Aggregates iterable values into groups keyed by selector.
 * 
 * @example
 * groupBy(['a', 'b', 'abc'], (x) => x.length) // Map { 1 => ['a', 'b'], 3 => ['abc'] }
 */
export function groupBy<T, K>(iterable: Iterable<T>, selector: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>();
  for (const item of iterable) {
    const key = selector(item);
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      groups.set(key, [item]);
    }
  }
  return groups;
}

/**
 * Partitions iterable into `[passing, failing]` buckets.
 * 
 * @example
 * partition([1, 2, 3], (x) => x % 2 === 0) // [[2], [1, 3]]
 */
export function partition<T>(iterable: Iterable<T>, predicate: (item: T, index: number) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  let index = 0;
  for (const item of iterable) {
    if (predicate(item, index++)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  }
  return [truthy, falsy];
}

/**
 * Zips multiple iterables together, stopping when the shortest ends.
 * 
 * @example
 * zip([1, 2], ['a', 'b', 'c']) // IterableIterator<[1, 'a'], [2, 'b']>
 */
export function zip<T extends unknown[]>(...iterables: { [K in keyof T]: Iterable<T[K]> }): IterableIterator<T> {
  return (function* () {
    const iterators = iterables.map((iter) => iter[Symbol.iterator]());
    while (true) {
      const results = iterators.map((it) => it.next());
      if (results.some((res) => res.done)) {
        break;
      }
      yield results.map((res) => res.value) as T;
    }
  })();
}

function isIterable(value: unknown): value is Iterable<unknown> {
  return typeof (value as Iterable<unknown>)?.[Symbol.iterator] === "function";
}
