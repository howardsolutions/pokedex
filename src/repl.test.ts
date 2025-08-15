import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";
import { Cache } from "./pokecache.js";

describe("cleanInput", () => {
  describe("basic functionality", () => {
    test("should clean input with spaces around words", () => {
      const input = "  hello  world  ";
      const expected = ["hello", "world"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle single word", () => {
      const input = "hello";
      const expected = ["hello"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle multiple words", () => {
      const input = "hello world test";
      const expected = ["hello", "world", "test"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });
  });

  describe("case handling", () => {
    test("should convert to lowercase", () => {
      const input = "HELLO WORLD";
      const expected = ["hello", "world"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle mixed case", () => {
      const input = "HeLLo WoRld";
      const expected = ["hello", "world"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });
  });

  describe("whitespace handling", () => {
    test("should handle multiple spaces between words", () => {
      const input = "hello    world";
      const expected = ["hello", "world"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle input with only spaces", () => {
      const input = "   ";
      const expected: string[] = [];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle empty string", () => {
      const input = "";

      const actual = cleanInput(input);
      
      expect(actual).toEqual([]);
    });
  });

  describe("edge cases", () => {
    test("should handle single character words", () => {
      const input = "a b c";
      const expected = ["a", "b", "c"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle numbers and special characters", () => {
      const input = "hello123 world!";
      const expected = ["hello123", "world!"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });

    test("should handle words with internal spaces (preserved)", () => {
      const input = "hello world";
      const expected = ["hello", "world"];
      const actual = cleanInput(input);
      
      expect(actual).toEqual(expected);
    });
  });
});

describe("Cache", () => {
  describe("basic functionality", () => {
    test("should add and retrieve values", () => {
      const cache = new Cache(1000);
      const key = "test-key";
      const value = "test-value";
      
      cache.add(key, value);
      const result = cache.get(key);
      
      expect(result?.val).toBe(value);
      expect(result?.createdAt).toBeDefined();
      
      cache.stopReapLoop();
    });

    test("should return undefined for non-existent keys", () => {
      const cache = new Cache(1000);
      const result = cache.get("non-existent");
      
      expect(result).toBeUndefined();
      
      cache.stopReapLoop();
    });

    test("should handle different data types", () => {
      const cache = new Cache(1000);
      
      cache.add("string", "hello");
      cache.add("number", 42);
      cache.add("object", { name: "test" });
      cache.add("array", [1, 2, 3]);
      
      expect(cache.get("string")?.val).toBe("hello");
      expect(cache.get("number")?.val).toBe(42);
      expect(cache.get("object")?.val).toEqual({ name: "test" });
      expect(cache.get("array")?.val).toEqual([1, 2, 3]);
      
      cache.stopReapLoop();
    });
  });

  describe("expiration behavior", () => {
    test.concurrent.each([
      {
        key: "https://example.com",
        val: "testdata",
        interval: 500, // 1/2 second
      },
      {
        key: "https://example.com/path",
        val: "moretestdata",
        interval: 1000, // 1 second
      },
      {
        key: "https://api.example.com",
        val: { data: "complex" },
        interval: 200, // 200ms
      },
    ])("Test Caching $interval ms", async ({ key, val, interval }) => {
      const cache = new Cache(interval);
    
      cache.add(key, val);
      const cached = cache.get(key);
      expect(cached?.val).toBe(val);
    
      // Wait for the entry to expire
      await new Promise((resolve) => setTimeout(resolve, interval + 50));
      
      // Manually trigger a reap to ensure expired entries are removed
      cache.reap();
      
      const reaped = cache.get(key);
      expect(reaped).toBeUndefined();
    
      cache.stopReapLoop();
    });

    test("should not expire values before interval", async () => {
      const cache = new Cache(1000);
      const key = "test-key";
      const value = "test-value";
      
      cache.add(key, value);
      
      // Wait for half the interval
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const result = cache.get(key);
      expect(result?.val).toBe(value);
      
      cache.stopReapLoop();
    });

    test("should handle multiple values with different timestamps", async () => {
      const cache = new Cache(1000);
      
      // Add first value
      cache.add("key1", "value1");
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Add second value
      cache.add("key2", "value2");
      
      // Wait for first value to expire
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Manually trigger reap to ensure expired entries are removed
      cache.reap();
      
      expect(cache.get("key1")).toBeUndefined();
      expect(cache.get("key2")?.val).toBe("value2");
      
      cache.stopReapLoop();
    });
  });

  describe("reap loop management", () => {
    test("should start reap loop on construction", () => {
      const cache = new Cache(1000);
      
      // The reap loop should be running
      expect(cache.get("test")).toBeUndefined();
      
      cache.stopReapLoop();
    });

    test("should stop reap loop when called", () => {
      const cache = new Cache(1000);
      
      cache.stopReapLoop();
      
      // After stopping, the cache should still work for immediate operations
      cache.add("test", "value");
      expect(cache.get("test")?.val).toBe("value");
    });

    test("should handle multiple stop calls gracefully", () => {
      const cache = new Cache(1000);
      
      cache.stopReapLoop();
      cache.stopReapLoop(); // Should not throw
      
      // Cache should still work
      cache.add("test", "value");
      expect(cache.get("test")?.val).toBe("value");
    });
  });

  describe("edge cases", () => {
    test("should handle very short intervals", async () => {
      const cache = new Cache(50); // 50ms interval
      
      cache.add("key", "value");
      expect(cache.get("key")?.val).toBe("value");
      
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(cache.get("key")).toBeUndefined();
      
      cache.stopReapLoop();
    });

    test("should handle very long intervals", () => {
      const cache = new Cache(3600000); // 1 hour
      
      cache.add("key", "value");
      const result = cache.get("key");
      
      expect(result?.val).toBe("value");
      
      cache.stopReapLoop();
    });

    test("should handle zero interval", () => {
      const cache = new Cache(0);
      
      cache.add("key", "value");
      const result = cache.get("key");
      
      expect(result?.val).toBe("value");
      
      cache.stopReapLoop();
    });

    test("should handle negative interval", () => {
      const cache = new Cache(-1000);
      
      cache.add("key", "value");
      const result = cache.get("key");
      
      expect(result?.val).toBe("value");
      
      cache.stopReapLoop();
    });
  });
});
