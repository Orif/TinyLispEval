export interface NumberLiteralExpression {
    type: "Number";
    value: number;
}

export interface IdentifierExpression {
    type: "Identifier";
    name: string;
    expression?: Expression;
}

export interface LambdaExpression {
    type: "Lambda";
    name: string;
    args: string[];
    body: Expression;
}

export interface CallExpression {
    type: "Call";
    name: string;
    args: Expression[];
}

export interface IfThenElseExpression {
    type: "If";
    condition: Expression;
    consequence: Expression;
    alternative: Expression;
}

export interface BlockExpression {
    type: "Block";
    expressions: Expression[];
}

export type Expression =
    BlockExpression
    | NumberLiteralExpression
    | IdentifierExpression
    | LambdaExpression
    | CallExpression
    | IfThenElseExpression;

export interface IExpressionVisitor {
    visit(expression: Expression): Expression;
}
