/**
 * Resource management utilities.
 */

/**
 * Interface for objects that hold resources that must be explicitly released.
 */
export interface IDisposable {
    dispose(): void;
}

/**
 * Checks if an object is an IDisposable.
 */
export function isDisposable(obj: any): obj is IDisposable {
    return obj && typeof obj.dispose === 'function';
}

/**
 * A container that manages a collection of disposables.
 * When the store is disposed, all contained disposables are released.
 * 
 * @example
 * const store = new DisposableStore();
 * store.add({ dispose: () => console.log('disposed!') });
 * store.dispose();
 */
export class DisposableStore implements IDisposable {
    private _disposables = new Set<IDisposable>();
    private _isDisposed = false;

    /**
     * Adds one or more disposables to the store.
     * If the store is already disposed, the added disposables are disposed immediately.
     */
    add<T extends IDisposable>(disposable: T): T;
    add<T extends IDisposable>(...disposables: T[]): T[];
    add<T extends IDisposable>(...disposables: T[]): T | T[] {
        for (const d of disposables) {
            if (this._isDisposed) {
                d.dispose();
            } else {
                this._disposables.add(d);
            }
        }
        return disposables.length === 1 ? disposables[0] : disposables;
    }

    /**
     * Disposes of all tracked resources and prevents further additions.
     */
    dispose(): void {
        if (this._isDisposed) return;
        this._isDisposed = true;
        this.clear();
    }

    /**
     * Disposes of all tracked resources but allows the store to be reused.
     */
    clear(): void {
        for (const d of this._disposables) {
            d.dispose();
        }
        this._disposables.clear();
    }
}

/**
 * Wraps a function into an IDisposable.
 * 
 * @example
 * const d = toDisposable(() => console.log('cleaned up'));
 * d.dispose();
 */
export function toDisposable(fn: () => void): IDisposable {
    let isDisposed = false;
    return {
        dispose: () => {
            if (isDisposed) return;
            isDisposed = true;
            fn();
        }
    };
}
