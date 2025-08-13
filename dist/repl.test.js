import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";
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
            const expected = [];
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
