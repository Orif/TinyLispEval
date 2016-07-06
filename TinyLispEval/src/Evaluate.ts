import { Environment } from "./Environment";
import { StandardEnvironment } from "./StandardEnvironment";
import { CstNodeEnvironment } from "./CstNodeEnvironment";
import { ICstNode, INumberCstNode, IIdentifierCstNode, ICallCstNode, IExpressionCstNode, ICstBody } from "./Transformer";

const standardEnvironment = new StandardEnvironment();
const env = new CstNodeEnvironment(standardEnvironment);

export function evaluate(node: ICstNode): ICstNode {
    switch (node.type) {
        case "NumberLiteral":
            return node;

        case "Identifier":
            return env.find((<IIdentifierCstNode>node).name);

        case "CallExpression":
            return env.find((<ICallCstNode>node).callee.type);

        case "ExpressionStatement":
            return env.find((<ICallCstNode>node).callee.type);

        case "Program":
            return env.find((<ICallCstNode>node).callee.type);

        default:
            throw new TypeError(`Unknown type: ${node.type}`);
    }

    //def eval(x, env=global_env):

    //    if isinstance(x, Symbol):      # variable reference
    //        return env.find(x)[x]

    //    elif not isinstance(x, List):  # constant literal
    //        return x

    //    elif x[0] == 'quote':          # quotation
    //        (_, exp) = x
    //        return exp

    //    elif x[0] == 'if':             # conditional
    //        (_, test, conseq, alt) = x
    //        exp = (conseq if eval(test, env) else alt)
    //        return eval(exp, env)

    //    elif x[0] == 'define':         # definition
    //        (_, var, exp) = x
    //        env[var] = eval(exp, env)

    //    elif x[0] == 'set!':           # assignment
    //        (_, var, exp) = x
    //        env.find(var)[var] = eval(exp, env)

    //    elif x[0] == 'lambda':         # procedure
    //        (_, parms, body) = x
    //        return Procedure(parms, body, env)

    //    else:                          # procedure call
    //        proc = eval(x[0], env)
    //        args = [eval(arg, env) for arg in x[1:]]
    //        return proc(*args)
}
