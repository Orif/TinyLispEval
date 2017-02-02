export function isNumeric(n: string | any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isNullOrEmpty(array: string | any[]): boolean {
    return !(array && array.length);
}

export function isNullOrWhitespace(value: string): boolean {
    return !(value && value.trim().length);
}
