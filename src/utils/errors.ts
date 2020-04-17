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

export class NotFoundException extends Error {
    constructor(message: string) {
        super(message);
    }
}
export class NetworkDeviceNotFoundException extends NotFoundException {
    constructor() {
        super(`Device not found on network!!!`);
    }
}

export class UnknownDeviceException extends Error {
    constructor() {
        super(`Oops! We don't know how to talk to this device!`);
    }
}

export class DeviceAlreadyAddedException extends Error {
    constructor() {
        super(`Oops! Looks like you already added this device!`);
    }
}

export class DuplicateDeviceNameException extends Error {
    constructor() {
        super(
            `Oops! Looks like you already used this name for another device!`
        );
    }
}
