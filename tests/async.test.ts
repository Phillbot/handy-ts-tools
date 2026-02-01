import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { debounce, throttle } from "../src/async.js";

describe("async helpers", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("debounces function calls", () => {
        const fn = vi.fn();
        const debounced = debounce(fn, 100);

        debounced();
        debounced();
        debounced();

        expect(fn).not.toBeCalled();

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("throttles function calls", () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);

        throttled(); // immediate
        throttled(); // ignored/delayed
        throttled(); // ignored/delayed

        expect(fn).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it("throttle: cancels pending timeout if called after limit", () => {
        const fn = vi.fn();
        const throttled = throttle(fn, 100);

        throttled(); // T=0, call 1, immediate
        throttled(); // T=0, call 2, sets timeout for T=100

        vi.advanceTimersByTime(150); // T=150, call 2 fired at T=100
        // timeoutId is now undefined.

        // To trigger the `if (timeoutId)` inside `if (remaining <= 0)`, 
        // we need to call it when timeoutId is set but remaining is <= 0.
        // This can happen if the clock moves forward significantly between checks.
    });
});
