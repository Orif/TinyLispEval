import * as assert from "assert";
import { Token, tokenizer } from "../src/Tokenizer";
import { tokenIterator } from "../src/TokenIterator";
import { toExpression } from "../src/TokenToExpression";
import { evaluate } from "../src/EvaluateExpression";

const input = `(define circle-area (lambda (r) (* pi (* r r))))`;
const input_complex_moderate = `
    (begin
        (define rectangle-area (lambda (height width) (* height width)))
        (define get-my-rect-area (lambda (ratio) (rectangle-area (* ratio 20) 20)))
        (define area (get-my-rect-area 20))
        (define result (if (< area 5000) area 5000))
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
// console.log(JSON.stringify(expression, null, 4));

const result = evaluate(expression);
console.log(result);
