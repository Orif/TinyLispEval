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

import { Scope } from "./Scope";

function visit(expression: Expression, scope: Scope): any {
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
            return visitLambda(expression, scope);
            //return;

        case "Block":
            return visitBlock(expression, scope);
    }

    throw new TypeError(`Unknown expression: ${expression}`);
}

function visitIdentifier(identifierExpression: IdentifierExpression, scope: Scope): any {
    // todo: check if the identifier exists

    let value = scope.find(identifierExpression.name);
    if (!value) {
        value = visit(identifierExpression.expression, scope);
        scope.add(identifierExpression.name, value);
    }

    return value;
}

function visitLambda(lambdaExpression: LambdaExpression, scope: Scope) {
    switch (lambdaExpression.body.type) {
        case "Call":
        case "If":
            break;

        default:
            throw new SyntaxError(`Not supported (yet) expression: ${lambdaExpression.body.type}`);
    }

    const childScope = scope.createChildScope();
    scope.add(lambdaExpression.name, (...args: Array<any>) => {
        lambdaExpression.args.forEach((arg: string, index: number) => childScope.add(arg, args[index]));
        return visit(lambdaExpression.body, childScope);
    });
}

function visitIfThenElse(expression: IfThenElseExpression, scope: Scope): any {
    return (visit(expression.condition, scope) === true
        ? visit(expression.consequence, scope)
        : visit(expression.alternative, scope));
}

function visitCall(callExpression: CallExpression, scope: Scope): any {
    const func = scope.find<Function>(callExpression.name);
    if (!func || !(func instanceof Function)) {
        throw new SyntaxError(`Unknown expression: ${func}`);
    }

    const args = callExpression.args.map(arg => visit(arg, scope));

    const result = func(...args);
    return result;
}

function visitBlock(blockExpression: BlockExpression, scope: Scope): any {
    const results = blockExpression.expressions.map(expression => visit(expression, scope));
    return results[results.length - 1];
}

export function evaluate(expression: Expression): any {
    return visit(expression, Scope.defaultScope.createChildScope());
}
