import * as assert from "assert";
import { evaluate } from "../src/Evaluate";

function evalAssert(expression: string, result: string) {
    //assert.deepStrictEqual(evaluate(expression), result);
    assert.deepStrictEqual(expression, result);
}

evalAssert(`(quote (testing 1 (2.0) -3.14e159))`, `(testing 1 (2.0) -3.14e159)`);
evalAssert(`(+ 2 2)`, `4`);
evalAssert(`(+ (* 2 100) (* 1 10))`, `210`);
evalAssert(`(if (> 6 5) (+ 1 1) (+ 2 2))`, `2`);
evalAssert(`(if (< 6 5) (+ 1 1) (+ 2 2))`, `4`);
evalAssert(`(define x 3)`, `3`);
evalAssert(`x`, `3`);
evalAssert(`(+ x x)`, `6`);
evalAssert(`(begin (define x 1) (set! x (+ x 1)) (+ x 1))`, `3`);
evalAssert(`((lambda (x) (+ x x)) 5)`, `10`);
evalAssert(`(define twice (lambda (x) (* 2 x)))`, `<Lambda>`);
evalAssert(`(twice 5)`, `10`);
evalAssert(`(define compose (lambda (f g) (lambda (x) (f (g x)))))`, `<Lambda>`);
evalAssert(`((compose list twice) 5)`, `(10)`);
evalAssert(`(define repeat (lambda (f) (compose f f)))`, `<Lambda>`);
evalAssert(`((repeat twice) 5)`, `20`);
evalAssert(`((repeat (repeat twice)) 5)`, `80`);
evalAssert(`(define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))`, `<Lambda>`);
evalAssert(`(fact 3)`, `6`);
evalAssert(`(fact 12)`, `479001600`);
//evalAndAssert(`(fact 50)`, `30414093201713378043612608166064768844377641568960512000000000000`);
evalAssert(`(define abs (lambda (n) ((if (> n 0) + -) 0 n)))`, `<Lambda>`);
evalAssert(`(list (abs -3) (abs 0) (abs 3))`, `(3 0 3)`);
assert.deepStrictEqual(
    `(define combine (lambda (f)
         (lambda (x y)
             (if (null? x) (quote ())
             (f (list (car x) (car y))
             ((combine f) (cdr x) (cdr y)))))))`, `<Lambda>`);
evalAssert(`(define zip (combine cons))`, `<Lambda>`);
evalAssert(`(zip (list 1 2 3 4) (list 5 6 7 8))`, `((1 5) (2 6) (3 7) (4 8))`);
assert.deepStrictEqual(
    `(define riff-shuffle (lambda (deck) (begin
         (define take (lambda (n seq) (if (<= n 0) (quote ()) (cons (car seq) (take (- n 1) (cdr seq))))))
         (define drop (lambda (n seq) (if (<= n 0) seq (drop (- n 1) (cdr seq)))))
         (define mid (lambda (seq) (/ (length seq) 2)))
         ((combine append) (take (mid deck) deck) (drop (mid deck) deck)))))`, `<Lambda>`);
evalAssert(`(riff-shuffle (list 1 2 3 4 5 6 7 8))`, `(1 5 2 6 3 7 4 8)`);
evalAssert(`((repeat riff-shuffle) (list 1 2 3 4 5 6 7 8))`, `(1 3 5 7 2 4 6 8)`);
evalAssert(`(riff-shuffle (riff-shuffle (riff-shuffle (list 1 2 3 4 5 6 7 8))))`, `(1 2 3 4 5 6 7 8)`);

console.log('All Passed!');
