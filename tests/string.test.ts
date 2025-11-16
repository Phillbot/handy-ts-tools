import { describe, expect, it } from "vitest";
import { camelCase, capitalize, ensurePrefix, ensureSuffix, kebabCase, snakeCase, titleCase, truncate } from "../src/string.js";

describe("string helpers", () => {
  it("ensures prefix and suffix correctly", () => {
    expect(ensurePrefix("kit", "ts-")).toBe("ts-kit");
    expect(ensurePrefix("ts-kit", "ts-")).toBe("ts-kit");
    expect(ensureSuffix("ts", "-kit")).toBe("ts-kit");
    expect(ensureSuffix("ts-kit", "-kit")).toBe("ts-kit");
  });

  it("capitalizes the first character", () => {
    expect(capitalize("kit")).toBe("Kit");
    expect(capitalize("")).toBe("");
  });

  it("truncates and appends ellipsis when needed", () => {
    expect(truncate("typescript", 4)).toBe("t...");
    expect(truncate("ts", 10)).toBe("ts");
    expect(truncate("typescript", 0)).toBe("");
  });

  it("converts to camel/kebab/snake/title cases", () => {
    expect(camelCase("handy_ts-tools")).toBe("handyTsTools");
    expect(kebabCase("handyTsTools")).toBe("handy-ts-tools");
    expect(snakeCase("handy ts tools")).toBe("handy_ts_tools");
    expect(titleCase("handy-ts_tools")).toBe("Handy Ts Tools");
  });
});
