import { describe, expect, it } from "vitest";
import { createDeferred } from "../src/promise.js";

describe("promise helpers", () => {
  it("resolves deferred promise when resolve is called", async () => {
    const deferred = createDeferred<string>();
    setTimeout(() => deferred.resolve("ok"), 0);
    await expect(deferred.promise).resolves.toBe("ok");
  });

  it("rejects deferred promise when reject is called", async () => {
    const deferred = createDeferred<string>();
    setTimeout(() => deferred.reject(new Error("fail")), 0);
    await expect(deferred.promise).rejects.toThrow("fail");
  });
});
