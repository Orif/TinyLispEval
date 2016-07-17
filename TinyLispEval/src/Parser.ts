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
        const [argsBody, body] = value.tokens;
        const args = (argsBody as SymbolToken).tokens.map(arg => arg.value);

        return {
            type: "Expression",
            name: id_node.value,
            args: args,
            body: toExpression(body)
        };
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

// todo
function toQuoteExpression(token: SymbolToken): Expression {
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

function toCallExpression(token: SymbolToken): CallExpression {
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

                case "set!": // todo: check if the identifier exists
                    return toSetIdentifierExpression(token);

                case "lambda":
                    return toLambdaExpression(token);

                case "begin":
                    const expressions = token.tokens.map(toExpression);
                    return {
                        type: "Block",
                        expressions: expressions
                    };

                default:
                    // a function call with params
                    if ((token.tokens || []).length > 0) {
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
    return toExpression(reduce(input));
}

export { parse }
