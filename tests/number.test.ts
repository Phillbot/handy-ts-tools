import { describe, expect, it } from "vitest";
import { inRange, lerp, normalize, randomInt, roundTo, toPercent } from "../src/number.js";

describe("number helpers", () => {
  it("rounds to provided precision", () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.235, 2)).toBe(1.24);
    expect(roundTo(10, -1)).toBe(10); // negative precision treated as power divisor
    expect(roundTo(0.1234, 3)).toBe(0.123);
  });

  it("checks range inclusively and exclusively", () => {
    expect(inRange(5, 0, 10)).toBe(true);
    expect(inRange(10, 0, 10, false)).toBe(false);
    expect(() => inRange(5, 10, 0)).toThrow();
  });

  it("converts ratios to percent", () => {
    expect(toPercent(1, 4, 1)).toBe(25.0);
    expect(() => toPercent(1, 0)).toThrow();
  });

  it("generates random integers", () => {
    const val = randomInt(1, 10);
    expect(val).toBeGreaterThanOrEqual(1);
    expect(val).toBeLessThanOrEqual(10);
    expect(Number.isInteger(val)).toBe(true);
    expect(() => randomInt(10, 1)).toThrow();
  });

  it("performs linear interpolation", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("normalizes values", () => {
    expect(normalize(50, 0, 100)).toBe(0.5);
    expect(normalize(0, 0, 100)).toBe(0);
    expect(normalize(100, 0, 100)).toBe(1);
    expect(normalize(50, 50, 50)).toBe(0);
  });
});
