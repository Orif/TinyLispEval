﻿import { Token } from "./Tokenizer";

import {
    ParsedTreeNode,
    SymbolNode
} from "./TokenIterator";

import {
    NumberLiteralExpression,
    IdentifierExpression,
    LambdaExpression,
    CallExpression,
    IfThenElseExpression,
    BlockExpression,
    Expression,
    IExpressionVisitor
} from "./Expression";

function toIdentifierExpression(node: SymbolNode): IdentifierExpression {
    return {
        type: "Identifier",
        name: node.name,
        expression: undefined
    };
}

function toSetIdentifierExpression(node: SymbolNode): IdentifierExpression | LambdaExpression {
    const [id_node, value] = node.params;

    if (value.type === "Symbol" && value.name === "lambda") {
        const [argsBody, body] = value.params;
        const argsStart = argsBody as SymbolNode;
        const args = [argsStart.name, ...argsStart.params.map(arg => (arg as SymbolNode).name)];

        return {
            type: "Expression",
            name: (id_node as SymbolNode).name,
            args: args,
            body: toExpression(body)
        };
    }

    return {
        type: "Identifier",
        name: (id_node as SymbolNode).name,
        expression: toExpression(value)
    };
}

function toConditionalExpression(node: SymbolNode): IfThenElseExpression {
    const [condition, consequence, alternative] = node.params;

    return {
        type: "If",
        condition: toExpression(condition),
        consequence: toExpression(consequence),
        alternative: toExpression(alternative)
    };
}

// todo
function toQuoteExpression(node: SymbolNode): Expression {
    return undefined;
}

function toLambdaExpression(node: SymbolNode): LambdaExpression {
    const [argsBody, body] = node.params;
    const argsStart = argsBody as SymbolNode;
    const args = [argsStart.name, ...argsStart.params.map(arg => (arg as SymbolNode).name)];

    return {
        type: "Expression",
        name: node.name,
        args: args,
        body: toExpression(body)
    };
}

function toCallExpression(node: SymbolNode): CallExpression {
    const args = node.params.map(toExpression);

    return {
        type: "Call",
        name: node.name,
        args: args
    };
}

function toExpression(node: ParsedTreeNode): Expression {
    switch (node.type) {
        case "NumberLiteral":
            return {
                type: "Number",
                value: (node.value as any) * 1.0
            };

        case "Program":
            const expressions = node.body.map(toExpression);
            return {
                type: "Block",
                expressions: expressions
            };

        case "Symbol":
            switch (node.name) {
                case "define":
                    return toSetIdentifierExpression(node);

                case "if":
                    return toConditionalExpression(node);

                case "quote":
                    return toQuoteExpression(node);

                case "set!": // todo: check if the identifier exists
                    return toSetIdentifierExpression(node);

                case "lambda":
                    return toLambdaExpression(node);

                case "begin":
                    const expressions = node.params.map(toExpression);
                    return {
                        type: "Block",
                        expressions: expressions
                    };

                default:
                    // a function call with params
                    if (node.params.length > 0) {
                        return toCallExpression(node);
                    }

                    // just a reference to an identifier
                    return toIdentifierExpression(node);
            }
    }

    throw new TypeError(`Unexpected parsed node: ${node}`);
}

export { toExpression }
