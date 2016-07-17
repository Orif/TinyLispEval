import * as assert from "assert";
import { tokenize } from "../src/Lexer";
import { parse } from "../src/Parser";
import { evaluate } from "../src/EvaluateExpression";

function interpret(source: string): void {
    const tokenized = tokenize(source);
    //console.log("tokenized", JSON.stringify(tokenized, null, 4));

    const parsed = parse(tokenized);
    //console.log(JSON.stringify(parsed, null, 4));

    const evaluated = evaluate(parsed);
    console.log(evaluated);
}

const input = `((lambda (x) (* x x)) 5)`;
const input_2 = `(* ((lambda (x) (* x x)) 5) 12)`;
const input_3 = `(* ((lambda (x) (* x ((lambda (x y) (- x y)) 96 64))) 5) 10)`;

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

const recursive_lambda = `
    (begin
        (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))
        (define x (fact 8))
    )
`;

//console.log(JSON.stringify(parse(tokenize(input_complex_2)), null, 4), JSON.stringify(parse(tokenize(input)), null, 4));

//interpret(input);
//interpret(input_2);
//interpret(input_3);
//interpret(input_complex_moderate);
//interpret(input_complex);
//interpret(input_complex_2);
interpret(recursive_lambda);
