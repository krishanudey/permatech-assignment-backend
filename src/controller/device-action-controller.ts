import { NextFunction, Request, Response } from "express";
import { DeviceHelperInstance, SmartDevice } from "../service/device-helper";
import { HTTP_API_ERROR_CODE } from "../utils/custom-error-codes";
import {
    OutOfRangeException,
    InvalidActionException,
    ArgumentFormatException,
    InvalidArgumentException,
    NetworkDeviceNotFoundException,
    UnknownDeviceException,
} from "../utils/errors";

export const performAction = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const uuid = req.params.uuid;
    const { action, args } = req.body;
    try {
        if (!uuid) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "UUID not provided!!!",
            });
        }

        if (!action) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "Action not provided!!!",
            });
        }

        const device: SmartDevice = await DeviceHelperInstance.getDeviceConnection(
            uuid
        );

        const result = await device.performAction(action, args);
        res.json(result);
    } catch (err) {
        if (
            err instanceof OutOfRangeException ||
            err instanceof InvalidArgumentException ||
            err instanceof ArgumentFormatException
        ) {
            res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: err.message,
                details: { uuid, action, args },
            });
        } else if (err instanceof InvalidActionException) {
            res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: err.message,
                details: { uuid, action, args },
            });
        } else if (err instanceof NetworkDeviceNotFoundException) {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.NOT_FOUND,
                message: err.message,
                details: { uuid, action, args },
            });
        } else if (err instanceof UnknownDeviceException) {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
                details: { uuid, action, args },
            });
        } else {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
                details: { uuid, action, args },
            });
        }
    }
};

export const getStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const uuid = req.params.uuid;
    try {
        if (!uuid) {
            return res.status(400).json({
                reason: HTTP_API_ERROR_CODE.VALIDATION_FAILED,
                message: "UUID not provided!!!",
            });
        }

        const device: SmartDevice = await DeviceHelperInstance.getDeviceConnection(
            uuid
        );
        res.json(device.getState());
    } catch (err) {
        if (err instanceof NetworkDeviceNotFoundException) {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.NOT_FOUND,
                message: err.message,
                details: { uuid },
            });
        } else if (err instanceof UnknownDeviceException) {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
                details: { uuid },
            });
        } else {
            res.status(500).json({
                reason: HTTP_API_ERROR_CODE.INTERNAL_SERVER_ERROR,
                message: err.message,
                details: { uuid },
            });
        }
    }
};
