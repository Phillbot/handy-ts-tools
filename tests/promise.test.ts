import { describe, expect, it } from "vitest";
import { createDeferred, sleep, timeout } from "../src/promise.js";

describe("promise helpers", () => {
  it("resolves deferred promise when resolve is called", async () => {
    const deferred = createDeferred<string>();
    setTimeout(() => deferred.resolve("ok"), 0);
    const res = await deferred.promise;
    expect(res).toBe("ok");
  });

  it("sleeps for given time", async () => {
    const start = Date.now();
    await sleep(50);
    const diff = Date.now() - start;
    expect(diff).toBeGreaterThanOrEqual(40); // small tolerance
  });

  it("times out slow operations", async () => {
    const slow = sleep(100);
    await expect(timeout(slow, 20)).rejects.toThrow("Operation timed out");

    const fast = sleep(10).then(() => "done");
    await expect(timeout(fast, 50)).resolves.toBe("done");
  });

  it("rejects deferred promise when reject is called", async () => {
    const deferred = createDeferred<string>();
    setTimeout(() => deferred.reject(new Error("fail")), 0);
    await expect(deferred.promise).rejects.toThrow("fail");
  });
});
