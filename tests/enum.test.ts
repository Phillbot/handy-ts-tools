import { describe, expect, it } from "vitest";
import { parseEnumValue } from "../src/enum.js";

enum Status {
  Idle = "IDLE",
  Loading = "LOADING",
  Done = "DONE",
}

enum NumericStatus {
  A,
  B,
}

describe("enum helpers", () => {
  it("parses string enums with case sensitivity control", () => {
    expect(parseEnumValue(Status, "IDLE")).toBe(Status.Idle);
    expect(parseEnumValue(Status, "idle")).toBeUndefined();
    expect(parseEnumValue(Status, "idle", { caseInsensitive: true })).toBe(Status.Idle);
  });

  it("parses by key name when values are numeric", () => {
    expect(parseEnumValue(NumericStatus, "A")).toBe(NumericStatus.A);
    expect(parseEnumValue(NumericStatus, 1)).toBe(NumericStatus.B);
  });

  it("returns fallback when no value is matched", () => {
    expect(parseEnumValue(Status, "missing", { fallback: Status.Done })).toBe(Status.Done);
  });
});
