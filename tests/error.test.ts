import { describe, expect, it } from "vitest";
import { isErrorLike, retry, wrapError } from "../src/error.js";

describe("error helpers", () => {
  it("detects error-like objects", () => {
    expect(isErrorLike(new Error("boom"))).toBe(true);
    expect(isErrorLike({ name: "Oops", message: "boom" })).toBe(true);
    expect(isErrorLike(null)).toBe(false);
  });

  it("wraps errors with additional messages", async () => {
    const failing = wrapError(async () => {
      throw new Error("fail");
    }, "wrapped");

    await expect(failing()).rejects.toThrow("wrapped: fail");

    const nonError = wrapError(async () => {
      throw "fail";
    }, "wrapped");
    await expect(nonError()).rejects.toThrow("wrapped: fail");
  });

  it("retries asynchronous operations", async () => {
    let attempts = 0;
    const result = await retry(async () => {
      attempts += 1;
      if (attempts < 3) {
        throw new Error(`attempt ${attempts}`);
      }
      return "done";
    });
    expect(result).toBe("done");
    expect(attempts).toBe(3);

    let shortAttempts = 0;
    await expect(
      retry(
        async () => {
          shortAttempts += 1;
          throw new Error("nope");
        },
        { retries: 1, delayMs: 0, shouldRetry: () => false },
      ),
    ).rejects.toThrow();
    expect(shortAttempts).toBe(1);
  });
});
