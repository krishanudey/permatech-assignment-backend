import { Request, Response, NextFunction } from "express";
import { DeviceHelperInstance, DeviceType } from "../service/device-helper";
import { DatabaseInstance } from "../database/db";
import * as Joi from "@hapi/joi";
import {
    DeviceAlreadyAddedException,
    DuplicateDeviceNameException,
} from "../utils/errors";
import { HTTP_API_ERROR_CODE } from "../utils/custom-error-codes";

const addDeviceSchema = Joi.object().keys({
    name: Joi.string()
        .regex(/^[a-zA-Z0-9 ']*$/)
        .min(3)
        .max(30)
        .required()
        .messages({
            regex: `"name" can only contain letters, numbers, spaces and apostrophe (')`,
        }),
    uuid: Joi.string().uuid().required(),
    type: Joi.string()
        .valid(...Object.keys(DeviceType))
        .required(),
    ip: Joi.string().ip().required(),
    servicePort: Joi.number().min(1).max(65535).required(),
});

export const discoverDevicesOnNetwork = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const devices = await DeviceHelperInstance.findDevices();
        const response = devices.map((el: any) => {
            const added = DatabaseInstance.isDeviceUuidAdded(el.uuid);
            el.isAdded = added;
            return el;
        });

        res.json(response);
    } catch (err) {
        res.status(500).json({
            reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
};

export const getAllDevicesFromDb = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const d = DatabaseInstance.getDevices();
        return res.json(d);
    } catch (err) {
        res.status(500).json({
            reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
};

export const getDeviceByUuidFromDb = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const uuid = req.params.uuid;
        const validationResult = Joi.string().uuid().required().validate(uuid);
        if (validationResult.error || validationResult.errors) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "UUID not provided!!!",
            });
        }
        const d = DatabaseInstance.getDeviceByUuid(uuid);
        if (!d) {
            return res.status(404).json({
                reason: HTTP_API_ERROR_CODE.NOT_FOUND,
                message: "Device not Found!!!",
            });
        }
        return res.json(d);
    } catch (err) {
        res.status(500).json({
            reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
};

export const getDeviceByNameFromDb = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const name = req.params.name;
        if (!name) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "Name not provided!!!",
            });
        }
        const d = DatabaseInstance.getDeviceByName(name);
        return res.json(d);
    } catch (err) {
        res.status(500).json({
            reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
};

export const addDeviceToDb = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const validationResult = addDeviceSchema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({
            reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
            message: validationResult.error.message,
            details: validationResult.error.details,
        });
    }
    const { name, uuid, type, ip, servicePort } = req.body;
    try {
        const d = DatabaseInstance.addDevice(name, {
            uuid,
            ip,
            type,
            servicePort,
        });
        return res.json({ message: "Device added successfully", device: d });
    } catch (err) {
        if (err instanceof DeviceAlreadyAddedException) {
            res.status(400).json({
                reason: HTTP_API_ERROR_CODE.DEVICE_ALREADY_ADDED,
                message: err.message,
                details: { name, uuid, type, ip, servicePort },
            });
        } else if (err instanceof DuplicateDeviceNameException) {
            res.status(400).json({
                reason: HTTP_API_ERROR_CODE.DUPLICATE_DEVICE_NAME,
                message: err.message,
                details: { name, uuid, type, ip, servicePort },
            });
        } else {
            res.status(400).json({
                reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
                details: { name, uuid, type, ip, servicePort },
            });
        }
    }
};

export const removeDeviceFromDb = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const uuid = req.params.uuid;
        if (!uuid) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "UUID not provided!!!",
            });
        }
        const d = DatabaseInstance.removeDeviceByUuid(uuid);
        return res.json({ message: "Device removed successfully", device: d });
    } catch (err) {
        res.status(500).json({
            reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
            message: err.message,
        });
    }
};
