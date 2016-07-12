import {
    BlockExpression,
    NumberLiteralExpression,
    IdentifierExpression,
    LambdaExpression,
    CallExpression,
    Expression,
    IExpressionVisitor
} from "./Expression";

export class ExpressionVisitor implements IExpressionVisitor {
    visit(expression: Expression): Expression {
        return visit(expression);
    }
}

class Scope {
    private map: Map<string, Object>;
    private outerScope: Scope;

    constructor(outerScope: Scope) {
        this.outerScope = outerScope;
        this.map = new Map<string, Object>();
    }

    find<T>(symbolName: string): T {
        return (
            this.map.has(symbolName)
                ? <T>this.map.get(symbolName)
                : (this.outerScope
                    ? <T>this.outerScope.find(symbolName)
                    : undefined)
        );
    }
    add(symbolName: string, value: Object): void {
        this.map.set(symbolName, value);
    }

    createChildScope(): Scope {
        return new Scope(this);
    }

    static defaultScope: Scope = new DefaultScope();
}
class DefaultScope extends Scope {
    constructor() {
        super(undefined);

        // todo: add operators and Math functions
    }
}

function visit(expression: Expression, scope: Scope = Scope.defaultScope): Expression {
    switch (expression.type) {
        case "Number":
            return expression;

        case "Identifier":
            return visitIdentifier(expression, scope);

        case "Expression":
            return visitLambda(expression, scope);

        case "Call":
            return visitCall(expression, scope);
    }

    throw new TypeError(`Unknown type: ${expression.type}`);
}

function visitIdentifier(expression: Expression, scope: Scope = Scope.defaultScope): Expression {
    const identifierExpression = (<IdentifierExpression>expression);
    const value = scope.find<Expression>(identifierExpression.name);
    if (!value) {
        scope.add(identifierExpression.name, visit(identifierExpression.expression, scope));
    }

    return value;
}

function visitLambda(expression: Expression, scope: Scope = Scope.defaultScope): LambdaExpression {
    const lambdaExpression = <LambdaExpression>expression;
    const childScope = scope.createChildScope();// ignore arguments in AST for now
    // const body = (...args: Array<Expression>) => visit(lambdaExpression.expression, scope);
    const body = () => <NumberLiteralExpression>{ type: "Number", value: 1 };

    return {
        type: "Expression",
        name: lambdaExpression.name,
        expression: undefined,
        run: body
    };
}

function visitCall(expression: Expression, scope: Scope = Scope.defaultScope): Expression {
    const callExpression = <CallExpression>expression;

    const childScope = scope.createChildScope();
    const args = callExpression.args.map(arg => visit(arg, childScope));
    const lambda = visitLambda(callExpression.expression, scope);
    const callResult = lambda.run.apply(null, args);

    return <NumberLiteralExpression>{
        type: "Number",
        value: <number>callResult
    }
}