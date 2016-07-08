import { IAstNodeType, IAstNode, INumberAstNode, ICallAstNode, IAstBody, parser } from "./Parser";

interface ISymbolTable {
    has(key: string): boolean;
    get<T>(key: string): T;
    set<T>(key: string, value: T): void;
}

interface ISymbol extends IAstNode {
    stack: ISymbolTable;
    execute(...args: Array<Object>): Object;
}

class SymbolTable implements ISymbolTable {
    protected map: Map<string, Object>;
    parent: ISymbolTable;

    constructor(parent: ISymbolTable = undefined, map: Map<string, Object> = undefined) {
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

class StandardNodeStack extends SymbolTable {
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

            .set_fn("not", (value: boolean) => !value)


            //.set_fn("append", (first: any, second: any) => first + second)
            //.set_fn("apply", (first: any, second: any) => first + second)
            //.set_fn("begin", (first: any, second: any) => first + second)


            //'append':  op.add,  
            //'apply':   apply,
            //'begin':   lambda *x: x[-1],
            //'car':     lambda x: x[0],
            //'cdr':     lambda x: x[1:], 
            //'cons':    lambda x,y: [x] + y,
            //'eq?':     op.is_, 
            //'equal?':  op.eq, 
            //'length':  len, 
            //'list':    lambda *x: list(x), 
            //'list?':   lambda x: isinstance(x,list), 
            //'map':     map,
            //'max':     max,
            //'min':     min,
            //'not':     op.not_,
            //'null?':   lambda x: x == [], 
            //'number?': lambda x: isinstance(x, Number),   
            //'procedure?': callable,
            //'round':   round,
            //'symbol?': lambda x: isinstance(x, Symbol),

            ;
    }

    private set_fn(name: string, fn: Function): this {
        this.map.set(name, { stack: this, execute: fn });

        return this;
    }
}

const standardNodeStack = new StandardNodeStack();

function evalSymbol(node: ICallAstNode, currentNodeStack: ISymbolTable = standardNodeStack): Object {

    return "";
}

export function interpret(node: IAstNode, currentNodeStack: ISymbolTable = standardNodeStack): Object {
    if (node.type === "Program") {
        return interpret((<IAstBody>node).body[0]);
    }

    if (node.type === "NumberLiteral") {
        return ((<INumberAstNode>node).value as any) * 1.0;
    }

    if (node.type === "CallExpression") {
        const callNode = <ICallAstNode>node;

        if (currentNodeStack.has(callNode.name)) {
            const captured = currentNodeStack.get<ISymbol>(callNode.name);
            const params = callNode.params.map(param => interpret(param, captured.stack));

            return captured.execute.apply(null, params);
        }

        const subNodeStack = new SymbolTable(currentNodeStack);

        subNodeStack.set(callNode.name, undefined);
    }

    return undefined;
}

class AstVisitor {
    visitProgram(node: IAstBody): Object {
        return this.visitExpression((<IAstBody>node).body[0]);
    }

    visitNumberLiteral(node: IAstNode): number {
        return ((<INumberAstNode>node).value as any) * 1.0;
    }

    visitExpression(node: IAstNode): Object {
        return (<ICallAstNode>node).params;
    }
}