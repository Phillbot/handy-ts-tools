/**
 * Helpers for working with Iterable values.
 */

/**
 * Converts an iterable into an array. Arrays are returned as shallow copies.
 */
export function toArray<T>(iterable: Iterable<T>): T[] {
  return Array.isArray(iterable) ? iterable.slice() : Array.from(iterable);
}

/**
 * Applies the mapper to each value as the iterable is consumed.
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
 * Splits iterable into chunks of a given size.
 */
/**
 * Splits an iterable into equally-sized chunks (last chunk may be shorter).
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
 * Groups values by key selector.
 */
/**
 * Aggregates iterable values into groups keyed by selector.
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
 * Partitions iterable into two arrays based on predicate.
 */
/**
 * Partitions iterable into `[passing, failing]` buckets.
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
 * Combines multiple iterables by index.
 */
/**
 * Zips multiple iterables together, stopping when the shortest ends.
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
