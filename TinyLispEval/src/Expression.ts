interface NumberLiteralExpression {
    type: "Number";
    value: number;
}

interface IdentifierExpression {
    type: "Identifier";
    name: string;
    expression: Expression;
}

interface LambdaExpression {
    type: "Expression";
    name: string;
    //args: Array<string>;
    body: Expression;
}

interface CallExpression {
    type: "Call";
    name: string;
    args: Array<Expression>;
}

interface IfThenElseExpression {
    type: "If";
    condition: Expression;
    consequence: Expression;
    alternative: Expression;
}

interface BlockExpression {
    type: "Block";
    expressions: Array<Expression>;
}

type Expression
    = BlockExpression
    | NumberLiteralExpression
    | IdentifierExpression
    | LambdaExpression
    | CallExpression
    | IfThenElseExpression;

interface IExpressionVisitor {
    visit(expression: Expression): Expression;
}

export {
    NumberLiteralExpression,
    IdentifierExpression,
    LambdaExpression,
    CallExpression,
    IfThenElseExpression,
    BlockExpression,
    Expression,
    IExpressionVisitor
}
