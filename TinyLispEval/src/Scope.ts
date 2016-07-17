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

export { Scope }