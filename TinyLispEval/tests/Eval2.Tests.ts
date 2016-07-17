import * as assert from "assert";
import { tokenize } from "../src/Lexer";
import { parse } from "../src/Parser";
import { evaluate } from "../src/EvaluateExpression";

function interpret(source: string): void {
    const tokenized = tokenize(source);
    //console.log("tokenized", JSON.stringify(tokenized, null, 4));

    const parsed = parse(tokenized);
    console.log(JSON.stringify(parsed, null, 4));

    const evaluated = evaluate(parsed);
    console.log(evaluated);
}

const input = `((lambda (x) (* x x)) 5)`;
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
const input_complex_2 = `
    (begin
        (define circle-area (lambda (r) (* pi (* r r))))
        (circle-area 10)
    )
`;

//console.log(JSON.stringify(parse(tokenize(input_complex_2)), null, 4), JSON.stringify(parse(tokenize(input)), null, 4));

// interpret(input_complex_2);
interpret(input);