import * as assert from "assert";
import { tokenize } from "../src/Lexer";
import { parse } from "../src/Parser";

const input = `((lambda (x) (+ x x)) 5)`;

const rootToken = tokenize(input);
//console.log("tokenized", JSON.stringify(rootToken, null, 4));

//const reducedRootToken = reduce(rootToken);
//console.log("reduced", JSON.stringify(reducedRootToken, null, 4));

const ast = parse(rootToken);
console.log(JSON.stringify(ast, null, 4));

const tree = {
    "type": "symbol",
    "tokens": [
        {
            "type": "symbol",
            "tokens": [
                {
                    "type": "symbol",
                    "tokens": [
                        {
                            "type": "symbol",
                            "value": "lambda"
                        },
                        {
                            "type": "symbol",
                            "tokens": [
                                {
                                    "type": "symbol",
                                    "value": "x"
                                }
                            ]
                        },
                        {
                            "type": "symbol",
                            "tokens": [
                                {
                                    "type": "symbol",
                                    "value": "+"
                                },
                                {
                                    "type": "symbol",
                                    "value": "x"
                                },
                                {
                                    "type": "symbol",
                                    "value": "x"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "number",
                    "value": "5"
                }
            ]
        }
    ]
}

// `((lambda (x) (+ x x)) 5)`
const reducedTree = {
    "type": "symbol",
    "tokens": [
        {
            "type": "symbol",
            "value": "lambda",
            "tokens": [
                {
                    "type": "symbol",
                    "value": "x"
                },
                {
                    "type": "symbol",
                    "value": "+",
                    "tokens": [
                        {
                            "type": "symbol",
                            "value": "x"
                        },
                        {
                            "type": "symbol",
                            "value": "x"
                        }
                    ]
                }
            ]
        },
        {
            "type": "number",
            "value": "5"
        }
    ]
}