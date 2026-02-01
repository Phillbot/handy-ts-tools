import { describe, expect, it, vi } from "vitest";
import { isBrowser, isNode, isTouchDevice } from "../src/platform.js";

describe("platform helpers", () => {
    it("detects browser environment", () => {
        // Vitest runs in Node by default
        expect(isBrowser()).toBe(false);
    });

    it("detects node environment", () => {
        expect(isNode()).toBe(true);
    });

    it("detects touch device support", () => {
        expect(isTouchDevice()).toBe(false);
    });

    // Since we can't easily mock global window/process in this environment without complex setup,
    // we'll at least verify they return boolean and reflect current (Node) environment.
});
