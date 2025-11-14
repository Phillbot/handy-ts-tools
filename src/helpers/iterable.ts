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

function isIterable(value: unknown): value is Iterable<unknown> {
  return typeof (value as Iterable<unknown>)?.[Symbol.iterator] === "function";
}
