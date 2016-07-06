import { Environment } from "./Environment";
import { ICstNode, INumberCstNode, IIdentifierCstNode, ICallCstNode, IExpressionCstNode, ICstBody } from "./Transformer";

export class StandardEnvironment extends Environment<Function> {
    constructor() {
        super();

        this.map.set("+", (first: any, second: any) => first + second);
        this.map.set("-", (first: any, second: any) => first - second);
        this.map.set("*", (first: any, second: any) => first * second);
        this.map.set("/", (first: any, second: any) => first / second);
        this.map.set(">", (first: any, second: any) => first > second);
        this.map.set("<", (first: any, second: any) => first < second);
        this.map.set(">=", (first: any, second: any) => first >= second);
        this.map.set("<=", (first: any, second: any) => first <= second);
        this.map.set("=", (first: any, second: any) => first = second);


        this.map.set("abs", Math.abs);
        this.map.set("max", Math.max);
        this.map.set("min", Math.min);
        this.map.set("not", (value: boolean) => !value);
        this.map.set("round", Math.round);


        // 'abs':           abs,
        // 'append':        op.add,
        // 'apply':         apply,
        // 'begin':         lambda * x: x[-1],
        // 'car':           lambda x: x[0],
        // 'cdr':           lambda x: x[1:], 
        // 'cons':          lambda x, y: [x] + y,
        // 'eq?':           op.is_,
        // 'equal?':        op.eq,
        // 'length':        len,
        // 'list':          lambda * x: list(x),
        // 'list?':         lambda x: isinstance(x, list),
        // 'map':           map,
        // 'max':           max,
        // 'min':           min,
        // 'not':           op.not_,
        // 'null?':         lambda x: x == [],
        // 'number?':       lambda x: isinstance(x, Number),
        // 'procedure?':    callable,
        // 'round':         round,
        // 'symbol?':       lambda x: isinstance(x, Symbol)
    }
}
