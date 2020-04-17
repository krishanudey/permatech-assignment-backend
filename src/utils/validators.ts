export function isValidColorString(input: string) {
    return /^#[0-9A-F]{6}$/i.test(input);
}
