import * as assert from "assert";
import { Token, tokenizer } from "../src/Tokenizer";

const input = "(add 2 (subtract 4 2))";

const tokens = [
    { type: "paren", value: "(" },
    { type: "symbol", value: "add" },
    { type: "number", value: "2" },
    { type: "paren", value: "(" },
    { type: "symbol", value: "subtract" },
    { type: "number", value: "4" },
    { type: "number", value: "2" },
    { type: "paren", value: ")" },
    { type: "paren", value: ")" }
];

assert.deepStrictEqual(tokenizer(input), tokens, "Tokenizer should turn `input` string into `tokens` array");

console.log("All Passed!");
