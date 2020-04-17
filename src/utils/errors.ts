export class OutOfRangeException extends Error {
    constructor(min: number, max: number) {
        super(`Value out of range. Value must be ${min} <= value <= ${max}`);
    }
}

export class IlligalArgumentException extends Error {
    constructor(values: string[]) {
        super(`Invalid value. Value must be any of [${values.join(", ")}]`);
    }
}

export class ArgumentFormatException extends Error {
    constructor(formats: string[]) {
        super(
            `Invalid format of value. Format must be any of [${formats.join(
                ", "
            )}]`
        );
    }
}
