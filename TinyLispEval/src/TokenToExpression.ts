import { Token } from "./Tokenizer";
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

type ExpressionType = "Number" | "Identifier" | "Expression" | "Call";

interface NumberNode {
    type: "NumberLiteral";
    value: string; // can be a really big number
}

interface SymbolNode {
    type: "Symbol";
    name?: string;
    params?: Array<ParsedTreeNode>;
}

interface BlockNode {
    type: "Program";
    body: Array<ParsedTreeNode>;
}

type ParsedTreeNode = NumberNode | SymbolNode | BlockNode;

function parser(tokens: Array<Token>): BlockNode {
    let current = 0;

    function walk(): ParsedTreeNode {
        let token = tokens[current];

        switch (token.type) {
            case "number":
                current++;

                return <NumberNode>{
                    type: "NumberLiteral",
                    value: token.value
                };

            case "symbol":
                current++;

                return <SymbolNode>{
                    type: "Symbol",
                    name: token.value,
                    params: []
                };

            case "paren":
                if (token.value === "(") {
                    token = tokens[++current];

                    const node: SymbolNode = {
                        type: "Symbol",
                        name: token.value,
                        params: []
                    };

                    token = tokens[++current];

                    while ((token.type !== "paren") || (token.type === "paren" && token.value !== ")")) {
                        node.params.push(walk());
                        token = tokens[current];
                    }

                    current++;

                    return node;
                }
                break;
        }

        throw new TypeError(`Unexpected token type: ${token.type}`);
    }

    const nodes: Array<ParsedTreeNode> = [];
    while (current < tokens.length) {
        nodes.push(walk());
    }

    return <BlockNode>{
        type: "Program",
        body: nodes
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
                    return toIdentifierExpression(node);

                case "if":
                    return toConditionalExpression(node);

                case "quote":
                    break;

                case "set!":
                    return toIdentifierExpression(node);

                case "lambda":
                    return toLambdaExpression(node);

                default:
                    // to call expression
                    break;
            }
            break;
    }

    throw new TypeError(`Unknown type of AST Node: ${node.type}`);
}

function toIdentifierExpression(node: SymbolNode): Expression {
    const [id_node, value] = node.params;
    const identifier: Expression = {
        type: "Identifier",
        name: (id_node as SymbolNode).name,
        expression: toExpression(value)
    };

    return identifier;
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

function toLambdaExpression(node: SymbolNode): Expression {
    return undefined;
}
