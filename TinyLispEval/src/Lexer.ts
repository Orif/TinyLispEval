import { isNumeric } from "./Utils";

interface NumberToken {
    type: "number";
    value: string;
}

interface SymbolToken {
    type: "symbol";
    value: string;
    tokens: Token[];
}

type Token = NumberToken | SymbolToken;

function toToken(value: string): Token {
    return (isNumeric(value)
        ? { type: "number", value: value }
        : { type: "symbol", value: value, tokens: [] }
    );
}

function iterateSource(source: string): string[] {
    const list: string[] = [];

    const WHITESPACE: RegExp = /\s/;
    const len = source.length;

    let i = 0;

    function skipWhitespace(): void {
        while (i < len && WHITESPACE.test(source[i])) {
            i++;
        }
    }
    function skipUntilWhitespace(): void {
        let ch: string;
        while (i < len && !WHITESPACE.test((ch = source[i])) && ch !== "(" && ch !== ")") {
            i++;
        }
    }

    function next(): string {
        skipWhitespace();

        switch (source[i]) {
            case "(":
            case ")":
                return source[i++];

            default:
                const start = i;
                skipUntilWhitespace();
                if (i > start) {
                    return source.substring(start, i);
                }
                break;
        }

        return "";
    }

    let token: string;
    while ((token = next()) !== "") {
        list.push(token);
    }

    return list;
}

const TokenEnd: SymbolToken = { type: "symbol", value: "EOF", tokens: [] };

function normalize(tokenValues: string[]): Token[] {
    let tokensLength: number;
    if (!(tokenValues && (tokensLength = tokenValues.length) > 0)) {
        return [];
    }

    let i = -1;
    let current: string = "";

    function read(): void {
        current = (i < tokensLength - 1) ? tokenValues[++i] : "";
    }

    function next(tokenString: string): Token {
        switch (tokenString) {
            case "":
                return TokenEnd;

            case "(":
                const list: Token[] = [];

                while (true) {
                    read();

                    if (current === ")") {
                        break;
                    }

                    const token = next(current);
                    if (!token) {
                        break;
                    }

                    list.push(token);
                }

                return {
                    type: "symbol",
                    value: "",
                    tokens: list
                };

            case ")":
                throw new SyntaxError(`Unexpected token: ")" at ${i}.`);
        }

        return toToken(tokenString);
    }

    const tokens: Token[] = [];

    while (true) {
        read();

        const token = next(current);
        if (token === TokenEnd) {
            break;
        }

        tokens.push(token);
    }

    return tokens;
}

function tokenize(source: string): SymbolToken {
    const stringTokens = iterateSource(source);
    const tokens = normalize(stringTokens);

    return (tokens.length === 1
        ? <SymbolToken>tokens[0]
        : { type: "symbol", value: "", tokens: tokens }
    );
}

export { NumberToken, SymbolToken, Token, tokenize }