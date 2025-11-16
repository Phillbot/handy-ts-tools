import { describe, expect, it } from "vitest";
import { inRange, roundTo, toPercent } from "../src/number.js";

describe("number helpers", () => {
  it("rounds to provided precision", () => {
    expect(roundTo(1.2345, 2)).toBe(1.23);
    expect(roundTo(1.235, 2)).toBe(1.24);
  });

  it("checks range inclusively and exclusively", () => {
    expect(inRange(5, 0, 10)).toBe(true);
    expect(inRange(10, 0, 10, false)).toBe(false);
  });

  it("converts ratios to percent", () => {
    expect(toPercent(1, 4, 1)).toBe(25.0);
  });
});
