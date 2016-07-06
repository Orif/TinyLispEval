import * as assert from "assert";
import { IToken, tokenizer } from "../src/Tokenizer";
import { parser } from "../src/Parser";
import { interpret } from "../src/EvalVisitor";

const input = '(+ 2 (- 4 2))';

const tokens = tokenizer(input);
const ast = parser(tokens);
const result = interpret(ast);

console.log(result);

//assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');

//console.log('All Passed!');
