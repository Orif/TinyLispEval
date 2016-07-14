import * as assert from "assert";
import { Token, tokenizer } from "../src/Tokenizer";
import { tokenIterator } from "../src/TokenIterator";
import { ExpressionVisitor } from "../src/ExpressionVisitor";
import { toExpression } from "../src/TokenToExpression";

const input = `(define circle-area (lambda (r) (* pi (* r r))))`;
const input_complex = `
    (begin
        (define circle-area (lambda (r) (* pi (* r r))))
        (define square-area (lambda (r) (* r r)))
    )
`;

const tokens = tokenizer(input_complex);
const ast = tokenIterator(tokens);
const expression = toExpression(ast);
console.log(JSON.stringify(expression, null, 4));

//const result = interpret(ast);

//const visitor = new ExpressionVisitor();
//const result = visitor.eval(expression);
//console.log(result);

//assert.deepStrictEqual(tokenizer(input), tokens, 'Tokenizer should turn `input` string into `tokens` array');

//console.log('All Passed!');
