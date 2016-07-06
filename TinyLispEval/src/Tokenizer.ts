type ITokenType = "number" | "paren" | "symbol";

interface IToken {
    type: ITokenType;
    value: string;
}

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

function tokenizer(input: string, current: number = 0): Array<IToken> {
    const tokens: Array<IToken> = [];

    current = skipWhitespace(input, current);

    while (current < input.length) {
        const char = input[current];
        if (char === "(") {
            tokens.push({
                type: "paren",
                value: "("
            });
            current++;

            continue;
        }

        if (char === ")") {
            tokens.push({
                type: "paren",
                value: ")"
            });
            current++;

            continue;
        }

        const endIndex = advance(input, current);
        if (endIndex > current) {
            const sub = input.substring(current, endIndex);
            const type: ITokenType = isNumeric(sub) ? "number" : "symbol";
            tokens.push({
                type: type,
                value: sub
            });

            current = endIndex;

            continue;
        }

        current++;
    }

    return tokens;
}

export { IToken, tokenizer };