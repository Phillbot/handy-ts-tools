import { describe, expect, it } from "vitest";
import { AssertionError, assert, assertDefined, assertNever } from "../src/asserts.js";

describe("assert helpers", () => {
  it("asserts truthy values", () => {
    expect(() => assert(true)).not.toThrow();
    expect(() => assert(false)).toThrow(AssertionError);
  });

  it("ensures defined values", () => {
    expect(assertDefined("ok")).toBe("ok");
    expect(() => assertDefined(undefined)).toThrow(/Expected value to be defined/);
  });

  it("assertNever throws for unexpected values", () => {
    expect(() => assertNever("boom" as unknown as never)).toThrow(/Unexpected value/);
  });
});
