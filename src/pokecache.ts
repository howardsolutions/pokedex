// CacheEntry<T> holds a cached object of type T and the timestamp when it was cached.
type CacheEntry<T> = {
    /** The timestamp (from Date.now()) when the entry was created */
    createdAt: number;
    /** The cached object */
    val: T;
}
export class Cache {
    #cache = new Map<string, CacheEntry<any>>();
    #reapIntervalId: NodeJS.Timeout | undefined = undefined;
    #interval: number;

    constructor(interval: number) {
        this.#interval = interval;
        this.#startReapLoop();
    }

    add<T>(key: string, val: T) {
        this.#cache.set(key, { createdAt: Date.now(), val: val });
    }

    get<T>(key: string): CacheEntry<any> | undefined {
        return this.#cache.get(key);
    }

    #reap() {
        const now = Date.now();
        const cutoff = now - this.#interval;
        
        for (const [key, entry] of this.#cache.entries()) {
            if (entry.createdAt < cutoff) {
                this.#cache.delete(key);
            }
        }
    }

    #startReapLoop() {
        // Run reap more frequently than the expiration interval for better reliability
        const reapFrequency = Math.min(this.#interval / 4, 100); // At least every 100ms, or 1/4 of interval
        this.#reapIntervalId = setInterval(() => {
            this.#reap();
        }, reapFrequency);
    }

    // Public method for testing - manually trigger a reap
    reap() {
        this.#reap();
    }

    stopReapLoop() {
        if (this.#reapIntervalId) {
            clearInterval(this.#reapIntervalId);
            this.#reapIntervalId = undefined;
        }
    }
}