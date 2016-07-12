interface ParenToken {
    type: "paren";
    value: string;
}

interface BeginParenToken extends ParenToken {
    type: "paren";
    value: "(";
}

interface EndParenToken extends ParenToken {
    type: "paren";
    value: ")";
}

interface NumberToken {
    type: "number";
    value: string;
}

interface SymbolToken {
    type: "symbol";
    value: string;
}

type Token = BeginParenToken | EndParenToken | NumberToken | SymbolToken;

const WHITESPACE: RegExp = /\s/;

function isNumeric(n: string | any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function skipWhitespace(text: string, index: number): number {
    const len = text.length;

    while (index < len && WHITESPACE.test(text[index])) {
        index++;
    }

    return index;
}
function advance(text: string, start: number): number {
    const len = text.length;
    let char = "";

    while (start < len && !WHITESPACE.test((char = text[start])) && char !== "(" && char !== ")") {
        start++;
    }

    return start;
}

function tokenizer(input: string, current: number = 0): Array<Token> {
    const tokens: Array<Token> = [];

    current = skipWhitespace(input, current);

    while (current < input.length) {
        const char = input[current];
        if (char === "(") {
            tokens.push(<BeginParenToken>{
                type: "paren",
                value: "("
            });
            current++;

            continue;
        }

        if (char === ")") {
            tokens.push(<EndParenToken>{
                type: "paren",
                value: ")"
            });
            current++;

            continue;
        }

        const endIndex = advance(input, current);
        if (endIndex > current) {
            const sub = input.substring(current, endIndex);

            tokens.push(<Token>{
                type: isNumeric(sub) ? "number" : "symbol",
                value: sub
            });

            current = endIndex;

            continue;
        }

        current++;
    }

    return tokens;
}

export { Token, tokenizer };
