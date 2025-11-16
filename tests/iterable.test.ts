import { describe, expect, it } from "vitest";
import {
  chunk,
  drop,
  filterIterable,
  flatMapIterable,
  groupBy,
  mapIterable,
  partition,
  reduceIterable,
  take,
  toArray,
  toMap,
  toSet,
  zip,
} from "../src/iterable.js";

describe("iterable helpers", () => {
  const sample = [1, 2, 3, 4];

  it("maps and filters lazily", () => {
    const result = toArray(filterIterable(mapIterable(sample, (v) => v * 2), (value) => value > 4));
    expect(result).toEqual([6, 8]);
  });

  it("takes and drops elements", () => {
    expect(toArray(take(sample, 2))).toEqual([1, 2]);
    expect(toArray(drop(sample, 2))).toEqual([3, 4]);
    expect(() => take(sample, -1)).toThrow();
    expect(() => drop(sample, -1)).toThrow();
  });

  it("flat maps and reduces to accumulator", () => {
    const flattened = toArray(flatMapIterable(sample, (value) => [value, value * 10]));
    expect(flattened).toEqual([1, 10, 2, 20, 3, 30, 4, 40]);

    const sum = reduceIterable(sample, (acc, value) => acc + value, 0);
    expect(sum).toBe(10);

    const flattenedValues = toArray(flatMapIterable(sample, (value) => value * 2));
    expect(flattenedValues).toEqual([2, 4, 6, 8]);
  });

  it("converts iterable to sets and maps", () => {
    const set = toSet([1, 2, 2], (value) => value * 2);
    expect(Array.from(set)).toEqual([2, 4]);
    expect(Array.from(toSet<number, number>([], (v) => v))).toEqual([]);

    const map = toMap(
      [{ id: "a", value: 1 }, { id: "b", value: 2 }],
      { key: (item) => item.id, value: (item) => item.value * 10 },
    );
    expect(Array.from(map.entries())).toEqual([
      ["a", 10],
      ["b", 20],
    ]);
    expect(Array.from(toMap<number, string, string>([], { key: (n) => String(n), value: String }))).toEqual([]);
  });

  it("chunks, groups, partitions, and zips", () => {
    expect(toArray(chunk(sample, 2))).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(() => Array.from(chunk(sample, 0))).toThrow();

    const grouped = groupBy(
      [
        { status: "done", id: 1 },
        { status: "todo", id: 2 },
        { status: "done", id: 3 },
      ],
      (item) => item.status,
    );
    expect(Array.from(grouped.get("done") ?? [])).toEqual([
      { status: "done", id: 1 },
      { status: "done", id: 3 },
    ]);

    const [evens, odds] = partition(sample, (value) => value % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3]);

    const zipped = toArray(zip([1, 2], ["a", "b", "c"]));
    expect(zipped).toEqual([
      [1, "a"],
      [2, "b"],
    ]);

    const zippedShort = toArray(zip([1], ["x", "y"]));
    expect(zippedShort).toEqual([[1, "x"]]);
  });
});
