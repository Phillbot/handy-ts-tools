import { describe, expect, it } from "vitest";
import {
  filterAsyncIterable,
  mapAsyncIterable,
  reduceAsyncIterable,
  takeAsync,
  toArrayAsync,
} from "../src/async-iterable.js";

async function* asyncFromArray<T>(values: readonly T[]) {
  for (const value of values) {
    await Promise.resolve();
    yield value;
  }
}

describe("async iterable helpers", () => {
  it("maps, filters, and takes values", async () => {
    const source = asyncFromArray([1, 2, 3, 4]);
    const mapped = mapAsyncIterable(source, (value) => value * 2);
    const filtered = filterAsyncIterable(mapped, async (value) => value >= 4);
    const taken = takeAsync(filtered, 2);
    await expect(toArrayAsync(taken)).resolves.toEqual([4, 6]);
  });

  it("reduces async iterable", async () => {
    const source = asyncFromArray([1, 2, 3]);
    const sum = await reduceAsyncIterable(source, (acc, value) => acc + value, 0);
    expect(sum).toBe(6);

    const empty = asyncFromArray<number>([]);
    const zero = await reduceAsyncIterable(empty, (acc, value) => acc + value, 0);
    expect(zero).toBe(0);

    const failing = asyncFromArray([1]);
    await expect(reduceAsyncIterable(failing, () => { throw new Error("boom"); }, 0)).rejects.toThrow("boom");
  });

  it("handles invalid counts", () => {
    expect(() => takeAsync(asyncFromArray([1]), -1)).toThrow();
  });
});
