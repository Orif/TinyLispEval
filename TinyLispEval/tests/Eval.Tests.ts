﻿import * as assert from "assert";
import { Token, tokenizer } from "../src/Tokenizer";
import { tokenIterator } from "../src/TokenIterator";
import { ExpressionVisitor } from "../src/ExpressionVisitor";
import { toExpression } from "../src/TokenToExpression";

const input = `(define circle-area (lambda (r) (* pi (* r r))))`;
const input_complex_moderate = `
    (begin
        (define rectangle-area (lambda (height width) (* height width)))
        (define get-my-rect-area (lambda (ratio) (rectangle-area (* ratio 20) 20)))
        (get-my-rect-area 20)
    )
`;
const input_complex = `
    (begin
        (define circle-area (lambda (r) (* pi (* r r))))
        (define square-area (lambda (r) (* r r)))
        (circle-area 10)
    )
`;

const tokens = tokenizer(input_complex_moderate);
const ast = tokenIterator(tokens);
const expression = toExpression(ast);
console.log(JSON.stringify(expression, null, 4));

const visitor = new ExpressionVisitor();
const result = visitor.eval(expression);
console.log(result);
