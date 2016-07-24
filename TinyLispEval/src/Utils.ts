function isNumeric(n: string | any): boolean {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNullOrEmpty(array: string | any[]): boolean {
    return !(array && array.length);
}

function isNullOrWhitespace(value: string): boolean {
    return !(value && value.trim().length);
}

export { isNumeric, isNullOrEmpty, isNullOrWhitespace }