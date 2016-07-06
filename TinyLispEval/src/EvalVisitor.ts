/*

There is a standard set of functions:
    - operators
    - math functions

*/

import { IAstNodeType, IAstNode, INumberAstNode, ICallAstNode, IAstBody, parser } from "./Parser";

interface INodeStack {
    has(key: string): boolean;
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}

interface IAstNodeWithContext extends IAstNode {
    stack: INodeStack;
    execute(...args: Array<Object>): Object;
}

class NodeStack implements INodeStack {
    protected map: Map<string, Object>;
    parent: INodeStack;

    constructor(parent: INodeStack = undefined, map: Map<string, Object> = undefined) {
        this.parent = parent;
        this.map = map ? map : new Map<string, Object>();
    }

    has(key: string): boolean {
        return this.map.has(key) || (this.parent && this.parent.has(key));
    }

    get<T>(key: string): T {
        if (this.map.has(key)) {
            return <T>this.map.get(key);
        }

        if (this.parent && this.parent.has(key)) {
            return <T>this.parent.get(key);
        }

        return undefined;
    }

    set<T>(key: string, value: T): void {
        this.map.set(key, value);
    }
}

class StandardNodeStack extends NodeStack {
    constructor() {
        super();

        this.set_fn("+", (first: any, second: any) => first + second)
            .set_fn("-", (first: any, second: any) => first - second)
            .set_fn("*", (first: any, second: any) => first * second)
            .set_fn("/", (first: any, second: any) => first / second)
            .set_fn(">", (first: any, second: any) => first > second)
            .set_fn("<", (first: any, second: any) => first < second)
            .set_fn(">=", (first: any, second: any) => first >= second)
            .set_fn("<=", (first: any, second: any) => first <= second)
            .set_fn("==", (first: any, second: any) => first == second)

            .set_fn("abs", Math.abs)
            .set_fn("min", Math.min)
            .set_fn("max", Math.max)
            .set_fn("round", Math.round)

            .set_fn("not", (value: boolean) => !value);
    }

    private set_fn(name: string, fn: Function): this {
        this.map.set(name, { stack: this, execute: fn });

        return this;
    }
}

const standardNodeStack = new StandardNodeStack();

export function interpret(node: IAstNode, currentNodeStack: INodeStack = standardNodeStack): Object {
    if (node.type === "Program") {
        return interpret((<IAstBody>node).body[0]);
    }

    if (node.type === "NumberLiteral") {
        return ((<INumberAstNode>node).value as any) * 1.0;
    }

    if (node.type === "CallExpression") {
        const callNode = <ICallAstNode>node;

        if (currentNodeStack.has(callNode.name)) {
            const captured = currentNodeStack.get<IAstNodeWithContext>(callNode.name);
            const params = callNode.params.map(param => interpret(param, captured.stack));

            return captured.execute.apply(null, params);
        }

        const subNodeStack = new NodeStack(currentNodeStack);

        subNodeStack.set(callNode.name, undefined);
    }

    return undefined;
}