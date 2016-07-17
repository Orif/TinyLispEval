import { isNullOrEmpty } from "./Utils";
import { NumberToken, SymbolToken, Token } from "./Lexer";

import {
    NumberLiteralExpression,
    IdentifierExpression,
    LambdaExpression,
    CallExpression,
    IfThenElseExpression,
    BlockExpression,
    Expression
} from "./Expression";

function toIdentifierExpression(token: SymbolToken): IdentifierExpression {
    return {
        type: "Identifier",
        name: token.value
    };
}

function toSetIdentifierExpression(token: SymbolToken): IdentifierExpression | LambdaExpression {
    const [id_node, value] = token.tokens;

    if (value.type === "symbol" && value.value === "lambda") {
        let lambda = toLambdaExpression(value);
        lambda.name = id_node.value;

        return lambda;
    }

    return {
        type: "Identifier",
        name: id_node.value,
        expression: toExpression(value)
    };
}

function toConditionalExpression(token: SymbolToken): IfThenElseExpression {
    const [condition, consequence, alternative] = token.tokens;

    return {
        type: "If",
        condition: toExpression(condition),
        consequence: toExpression(consequence),
        alternative: toExpression(alternative)
    };
}

function toQuoteExpression(token: SymbolToken): Expression {
    // todo
    return undefined;
}

function toLambdaExpression(token: SymbolToken): LambdaExpression {
    const [argsBody, body] = token.tokens;
    const argsStart = argsBody as SymbolToken;
    const argNames = [argsStart.value, ...(argsStart.tokens || []).map(arg => arg.value)];

    return {
        type: "Expression",
        name: token.value,
        args: argNames,
        body: toExpression(body)
    };
}

let __anon_id_counter__: number = 0;
function getUniqueName() {
    return `$$t_${__anon_id_counter__++}`;
}

function toAnonLambdaExpression(token: SymbolToken): IdentifierExpression {
    const uniqueName = `lambda_${getUniqueName()}`;

    const defineAnonIdentifierForLambda: SymbolToken = {
        type: "symbol",
        value: uniqueName
    };
    const defineLambda: SymbolToken = {
        type: "symbol",
        tokens: [defineAnonIdentifierForLambda, token]
    };

    const emitted = toSetIdentifierExpression(defineLambda);

    return <IdentifierExpression>emitted;
}

function toCallExpression(token: SymbolToken): CallExpression | BlockExpression {
    const [fn_node, ...params] = token.tokens;

    if (fn_node.type === "symbol" && fn_node.value === "lambda") {
        const identifierExpression = toAnonLambdaExpression(fn_node);
        const args = params.map(toExpression);

        const callExpression = {
            type: "Call",
            name: identifierExpression.name,
            args: args
        };

        return <BlockExpression>{
            type: "Block",
            expressions: [identifierExpression, callExpression]
        };
    }

    const call = toNamedCallExpression(token);

    return call;
}

function toNamedCallExpression(token: SymbolToken): CallExpression {
    const args = token.tokens.map(toExpression);

    return {
        type: "Call",
        name: token.value,
        args: args
    };
}

function toExpression(token: Token): Expression {
    switch (token.type) {
        case "number":
            return {
                type: "Number",
                value: (token.value as any) * 1.0
            };

        case "symbol":
            switch (token.value) {
                case "define":
                    return toSetIdentifierExpression(token);

                case "if":
                    return toConditionalExpression(token);

                case "quote":
                    return toQuoteExpression(token);

                case "set!":
                    // todo: check if the identifier exists
                    return toSetIdentifierExpression(token);

                case "lambda":
                    // if it ever reaches this line, then it means `lambda` was anonymous.
                    // and this lambda is only visible in this scope.
                    // we will emit:
                    //   1) a temp identifier a unique name
                    //   2) and body containing a lambda
                    //   3) call the the temp identifier
                    return toAnonLambdaExpression(token);

                case "begin":
                    const expressions = token.tokens.map(toExpression);
                    return {
                        type: "Block",
                        expressions: expressions
                    };

                default:
                    // a function call with params
                    if (!isNullOrEmpty(token.tokens)) {
                        return toCallExpression(token);
                    }
                    break;
            }

            // just a reference to an identifier
            return toIdentifierExpression(token);
    }

    throw new TypeError(`Unexpected parsed node: ${token}`);
}

function reduce(token: Token): Token {
    if (token.type === "symbol" && token.tokens && token.tokens.length > 0) {
        token.tokens = token.tokens.map(reduce);

        if (isNullOrEmpty(token.value)) {
            const [head, ...rest] = token.tokens;

            if (!isNullOrEmpty(head.value) && head.type === "symbol" && isNullOrEmpty(head.tokens)) { // safe to promote
                if (rest.length > 0) {
                    head.tokens = rest;
                }

                return head;
            }
        }
    }

    return token;
}

function parse(input: Token) {
    const reducedTree = reduce(input);
    return toExpression(reducedTree);
}

export { parse }
