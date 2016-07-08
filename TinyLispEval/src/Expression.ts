export type ExpressionType = "Number" | "Identifier" | "Expression" | "Call";

export interface IExpression {
    type: ExpressionType;
}

//export interface ILiteralExpression<T> extends IExpression {
//    type: "Literal";
//    value: T;
//}

export interface INumberLiteralExpression extends IExpression {
    type: "Number";
    value: number;
}

export interface IIdentifierExpression extends IExpression {
    type: "Identifier";
    name: string;
}

export interface ILambdaExpression extends IExpression {
    type: "Expression";
    name: string; // args: Array<string>; // probably a useful info, but atm not necessary.
    expression: IExpression;
    run: Function;
}

export interface ICallExpression extends IExpression {
    type: "Call";
    args: Array<IExpression>;
    expression: ILambdaExpression;
}

export interface IExpressionVisitor {
    visit(expression: IExpression): IExpression;
}

export class ExpressionVisitor implements IExpressionVisitor {
    scope: Map<string, Object>;

    constructor() {
        this.scope = new Map<string, Object>();
    }

    visit(expression: IExpression): IExpression {
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

function visit(expression: IExpression, scope: Scope = Scope.defaultScope): IExpression {
    switch (expression.type) {
        case "Number":
            return expression;

        case "Identifier":
            return scope.find<IExpression>((<IIdentifierExpression>expression).name);

        case "Expression":
            return visitLambda(expression, scope);

        case "Call":
            return visitCall(expression, scope);

        default:
            throw new TypeError(`Unknown type: ${expression.type}`);
    }
}

function visitLambda(expression: IExpression, scope: Scope = Scope.defaultScope): ILambdaExpression {
    const lambdaExpression = <ILambdaExpression>expression;
    const childScope = scope.createChildScope();
    const body = (...args: Array<IExpression>) => {

    };

    return {
        type: "Expression",
        name: lambdaExpression.name,
        expression: undefined,
        run: body
    };
}

function visitCall(expression: IExpression, scope: Scope = Scope.defaultScope): IExpression {
    const callExpression = <ICallExpression>expression;

    const childScope = scope.createChildScope();
    const args = callExpression.args.map(arg => visit(arg, childScope));
    const lambda = visitLambda(callExpression.expression, scope);
    const callResult = lambda.run.apply(null, args);

    return <INumberLiteralExpression>{
        type: "Number",
        value: <number>callResult
    }
}