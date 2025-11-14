/**
 * Helpers for AsyncIterable values.
 */

type MaybeAsyncIterable<T> = AsyncIterable<T> | Iterable<T>;

/**
 * Collects items from an async iterable into an array.
 */
export async function toArrayAsync<T>(iterable: MaybeAsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const value of iterable as AsyncIterable<T>) {
    result.push(value);
  }
  return result;
}

/**
 * Maps async iterable values lazily.
 */
export function mapAsyncIterable<T, R>(
  iterable: MaybeAsyncIterable<T>,
  mapper: (value: T, index: number) => Awaited<R>,
): AsyncIterableIterator<Awaited<R>> {
  return (async function* () {
    let index = 0;
    for await (const value of iterable as AsyncIterable<T>) {
      yield mapper(value, index++);
    }
  })();
}

/**
 * Filters async iterable values lazily.
 */
export function filterAsyncIterable<T>(
  iterable: MaybeAsyncIterable<T>,
  predicate: (value: T, index: number) => boolean | Promise<boolean>,
): AsyncIterableIterator<T> {
  return (async function* () {
    let index = 0;
    for await (const value of iterable as AsyncIterable<T>) {
      if (await predicate(value, index++)) {
        yield value;
      }
    }
  })();
}

/**
 * Takes the first `count` items from an async iterable.
 */
export function takeAsync<T>(iterable: MaybeAsyncIterable<T>, count: number): AsyncIterableIterator<T> {
  if (count < 0) {
    throw new RangeError("takeAsync: count must be >= 0");
  }

  return (async function* () {
    let yielded = 0;
    if (count === 0) {
      return;
    }
    for await (const value of iterable as AsyncIterable<T>) {
      yield value;
      if (++yielded >= count) {
        break;
      }
    }
  })();
}

/**
 * Reduces async iterable values into a single accumulator.
 */
export async function reduceAsyncIterable<T, R>(
  iterable: MaybeAsyncIterable<T>,
  reducer: (acc: R, value: T, index: number) => Awaited<R>,
  initialValue: Awaited<R>,
): Promise<Awaited<R>> {
  let acc = initialValue;
  let index = 0;
  for await (const value of iterable as AsyncIterable<T>) {
    acc = await reducer(acc, value, index++);
  }
  return acc;
}
