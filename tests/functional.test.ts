import { describe, expect, it } from "vitest";
import { clamp, compose, identity, memoize, noop, once, pipe } from "../src/functional.js";

describe("functional helpers", () => {
  it("returns the same value via identity and noop does nothing", () => {
    expect(identity({ a: 1 })).toEqual({ a: 1 });
    expect(() => noop()).not.toThrow();
  });

  it("pipes values through multiple transforms", () => {
    const result = pipe(
      2,
      (n: number) => n + 3,
      (n) => n * 2,
    );
    expect(result).toBe(10);
  });

  it("clamps numbers to the provided range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(20, 0, 10)).toBe(10);
  });

  it("composes, memoizes, and enforces single execution", () => {
    const composed = compose(
      (n: number) => n * 2,
      (n: number) => n + 3,
    );
    expect(composed(2)).toBe(10);

    let heavyCalls = 0;
    const heavy = memoize((n: number) => {
      heavyCalls += 1;
      return n * n;
    });
    expect(heavy(3)).toBe(9);
    expect(heavy(3)).toBe(9);
    expect(heavyCalls).toBe(1);

    let executions = 0;
    const initialize = once(() => {
      executions += 1;
      return executions;
    });
    expect(initialize()).toBe(1);
    expect(initialize()).toBe(1);
    expect(executions).toBe(1);
  });
});
