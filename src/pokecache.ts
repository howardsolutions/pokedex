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
        this.#reapIntervalId = setInterval(() => {
            this.#reap();
        }, this.#interval);
    }

    stopReapLoop() {
        if (this.#reapIntervalId) {
            clearInterval(this.#reapIntervalId);
            this.#reapIntervalId = undefined;
        }
    }
}