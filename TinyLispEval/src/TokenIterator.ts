import { Token } from "./Tokenizer";

interface NumberNode {
    type: "NumberLiteral";
    value: string; // can be a really big number
}

interface SymbolNode {
    type: "Symbol";
    name?: string;
    params?: Array<ParsedTreeNode>;
}

interface BlockNode {
    type: "Program";
    body: Array<ParsedTreeNode>;
}

type ParsedTreeNode = NumberNode | SymbolNode | BlockNode;

function tokenIterator(tokens: Array<Token>): BlockNode {
    let current = 0;

    function walk(): ParsedTreeNode {
        let token = tokens[current];

        switch (token.type) {
            case "number":
                current++;

                return <NumberNode>{
                    type: "NumberLiteral",
                    value: token.value
                };

            case "symbol":
                current++;

                return <SymbolNode>{
                    type: "Symbol",
                    name: token.value,
                    params: []
                };

            case "paren":
                if (token.value === "(") {
                    token = tokens[++current];

                    const name = token.value;
                    const params: Array<ParsedTreeNode> = [];

                    token = tokens[++current];

                    while ((token.type !== "paren") || (token.type === "paren" && token.value !== ")")) {
                        params.push(walk());
                        token = tokens[current];
                    }

                    current++;

                    return {
                        type: "Symbol",
                        name: name,
                        params: params
                    };
                }
                break;
        }

        throw new TypeError(`Unexpected token type: ${token.type}`);
    }

    const nodes: Array<ParsedTreeNode> = [];
    while (current < tokens.length) {
        nodes.push(walk());
    }

    return <BlockNode>{
        type: "Program",
        body: nodes
    };
}

export { ParsedTreeNode, NumberNode, SymbolNode, BlockNode, tokenIterator };