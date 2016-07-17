import {
    BlockExpression,
    NumberLiteralExpression,
    IdentifierExpression,
    LambdaExpression,
    IfThenElseExpression,
    CallExpression,
    Expression,
    IExpressionVisitor
} from "./Expression";

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

    static defaultScope: Scope = undefined;
}
class DefaultScope extends Scope {
    constructor() {
        super(undefined);

        this.add("+", (first: any, second: any) => first + second);
        this.add("-", (first: any, second: any) => first - second);
        this.add("*", (first: any, second: any) => first * second);
        this.add("/", (first: any, second: any) => first / second);

        this.add("pi", Math.PI);

        this.add(">", (first: any, second: any) => first > second);
        this.add("<", (first: any, second: any) => first < second);
        this.add(">=", (first: any, second: any) => first >= second);
        this.add("<=", (first: any, second: any) => first <= second);

        // todo: add operators and Math functions

        //this.map.set("abs", Math.abs);
        //this.map.set("max", Math.max);
        //this.map.set("min", Math.min);
        //this.map.set("not", (value: boolean) => !value);
        //this.map.set("round", Math.round);
    }
}

Scope.defaultScope = new DefaultScope();

function visit(expression: Expression, scope: Scope = Scope.defaultScope): any {
    switch (expression.type) {
        case "Number":
            return expression.value;

        case "Identifier":
            return visitIdentifier(expression, scope);

        case "If":
            return visitIfThenElse(expression, scope);

        case "Call":
            return visitCall(expression, scope);

        case "Expression":
            visitLambda(expression, scope);
            return;

        case "Block":
            return visitBlock(expression, scope);
    }

    throw new TypeError(`Unknown expression: ${expression}`);
}

function visitIdentifier(identifierExpression: IdentifierExpression, scope: Scope = Scope.defaultScope): any {
    // todo: check if the identifier exists

    let value = scope.find(identifierExpression.name);
    if (!value) {
        value = visit(identifierExpression.expression, scope);
        scope.add(identifierExpression.name, value);
    }

    return value;
}

function visitLambda(lambdaExpression: LambdaExpression, scope: Scope = Scope.defaultScope) {
    switch (lambdaExpression.body.type) {
        case "Call":
        case "If":
            break;

        default:
            throw new SyntaxError(`Not supported expression: ${lambdaExpression.body.type}`);
    }

    const childScope = scope.createChildScope();
    scope.add(lambdaExpression.name, (...args: Array<any>) => {
        lambdaExpression.args.forEach((arg: string, index: number) => childScope.add(arg, args[index]));
        return visit(lambdaExpression.body, childScope);
    });
}

function visitIfThenElse(expression: IfThenElseExpression, scope: Scope = Scope.defaultScope): any {
    return (visit(expression.condition) === true
        ? visit(expression.consequence)
        : visit(expression.alternative));
}

function visitCall(callExpression: CallExpression, scope: Scope = Scope.defaultScope): any {
    const func = scope.find<Function>(callExpression.name);
    if (!func || !(func instanceof Function)) {
        throw new SyntaxError(`Unknown expression: ${func}`);
    }

    const args = callExpression.args.map(arg => visit(arg, scope));

    const result = func(...args);
    return result;
}

function visitBlock(blockExpression: BlockExpression, scope: Scope = Scope.defaultScope): any {
    const results = blockExpression.expressions.map(expression => visit(expression));
    return results[results.length - 1];
}

export function evaluate(expression: Expression): any {
    return visit(expression);
}
