type ExpressionType = "Number" | "Identifier" | "Expression" | "Call" | "Block";

//interface ILiteralExpression<T>  {
//    type: "Literal";
//    value: T;
//}

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
    name: string; // args: Array<string>; // probably a useful info, but atm not necessary.
    expression: Expression;
    //run: Function;
    run: () => Expression;
}

interface CallExpression {
    type: "Call";
    args: Array<Expression>;
    expression: LambdaExpression;
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

type Expression = BlockExpression | NumberLiteralExpression | IdentifierExpression | LambdaExpression | CallExpression | IfThenElseExpression;

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
