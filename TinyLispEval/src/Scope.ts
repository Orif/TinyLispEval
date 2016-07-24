type NotFound = { VALUE: null };
const NotFoundValue: NotFound = { VALUE: null };

interface IScope {
    find<T>(symbolName: string): T | NotFound;
    add(symbolName: string, value: Object): void;
    createChildScope(): IScope;
}

class BaseScope implements IScope {
    protected map: Map<string, Object>;

    constructor() {
        this.map = new Map<string, Object>();
    }

    find<T>(symbolName: string): T | NotFound {
        return (this.map.has(symbolName) ? <T>this.map.get(symbolName) : NotFoundValue);
    }

    add(symbolName: string, value: Object): void {
        this.map.set(symbolName, value);
    }

    createChildScope(): IScope {
        return new Scope(this);
    }
}

class DefaultScope extends BaseScope {
    constructor() {
        super();

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

        // this.map.set("abs", Math.abs);
        // this.map.set("max", Math.max);
        // this.map.set("min", Math.min);
        // this.map.set("not", (value: boolean) => !value);
        // this.map.set("round", Math.round);
    }
}

class Scope extends BaseScope implements IScope {
    private parent: IScope;

    constructor(outerScope: IScope) {
        super();

        this.parent = outerScope;
    }

    find<T>(symbolName: string): T | NotFound {
        return (this.map.has(symbolName) ? <T>this.map.get(symbolName) : this.parent.find<T>(symbolName));
    }

    add(symbolName: string, value: Object): void {
        this.map.set(symbolName, value);
    }

    createChildScope(): Scope {
        return new Scope(this);
    }

    static defaultScope: IScope = new DefaultScope();
}

export { IScope, Scope, NotFoundValue }
