import { describe, expect, it, vi } from "vitest";
import { DisposableStore, isDisposable, toDisposable } from "../src/lifecycle.js";

describe("lifecycle helpers", () => {
    it("executes disposable action", () => {
        const fn = vi.fn();
        const d = toDisposable(fn);
        d.dispose();
        expect(fn).toHaveBeenCalledTimes(1);
        d.dispose(); // second call ignored
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("manages multiple disposables with DisposableStore", () => {
        const store = new DisposableStore();
        const fn1 = vi.fn();
        const fn2 = vi.fn();

        store.add(toDisposable(fn1));
        store.add(toDisposable(fn2));

        store.dispose();
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it("disposes immediately if store is already disposed", () => {
        const store = new DisposableStore();
        store.dispose();

        const fn = vi.fn();
        store.add(toDisposable(fn));
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("isDisposable: detects disposable and non-disposable values", () => {
        expect(isDisposable({ dispose: () => { } })).toBe(true);
        expect(isDisposable(null)).toBe(null);
        expect(isDisposable({})).toBe(false);
        expect(isDisposable(42)).toBe(false);
    });

    it("DisposableStore: clear() allows reuse", () => {
        const store = new DisposableStore();
        const fn = vi.fn();
        store.add(toDisposable(fn));
        store.clear();
        expect(fn).toHaveBeenCalledTimes(1);

        const fn2 = vi.fn();
        store.add(toDisposable(fn2));
        store.dispose();
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it("DisposableStore: supports adding multiple disposables", () => {
        const store = new DisposableStore();
        const d1 = toDisposable(() => { });
        const d2 = toDisposable(() => { });
        const res = store.add(d1, d2);
        expect(Array.isArray(res)).toBe(true);
        expect(res).toHaveLength(2);
    });

    it("DisposableStore: dispose() is idempotent", () => {
        const store = new DisposableStore();
        store.dispose();
        store.dispose(); // should return via line 51
    });
});
