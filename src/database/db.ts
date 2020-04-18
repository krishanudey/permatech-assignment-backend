import * as path from "path";
import * as fs from "fs-extra";
import { NetworkDevice } from "../service/device-helper";
import {
    DeviceAlreadyAddedException,
    DuplicateDeviceNameException,
    NotFoundException,
} from "../utils/errors";

export class Database {
    private state: {
        devices: DeviceConfig[];
    };
    private file: string;
    public constructor(private location: string) {
        this.state = {
            devices: [],
        };
        this.file = path.join(location, "db.json");
        if (fs.existsSync(this.file)) {
            try {
                const disk = fs.readJSONSync(this.file);
                this.state.devices = disk.devices || [];
                this.saveDB();
            } catch (err) {
                console.log("DB corrupted!!! Re-initializing...");
                this.initDB();
            }
        } else {
            console.log("DB does not exist!!! Initializing...");
            this.initDB();
        }
    }
    private initDB() {
        try {
            this.state = {
                devices: [],
            };
            this.saveDB();
        } catch (err) {
            throw new Error("Unable to initialize database");
        }
    }
    private saveDB() {
        try {
            fs.ensureFileSync(this.file);
            fs.writeJSONSync(this.file, this.state);
        } catch (err) {
            throw new Error("Unable to save database to file");
        }
    }

    getDevices(): DeviceConfig[] {
        return this.state.devices;
    }
    isDeviceUuidAdded(uuid: string): boolean {
        return this.getDeviceByUuid(uuid) ? true : false;
    }
    getDeviceByUuid(uuid: string): DeviceConfig {
        return this.state.devices.find((d) => d.deviceMeta.uuid === uuid);
    }
    getDeviceByName(name: string): DeviceConfig {
        return this.state.devices.find((d) => d.name === name);
    }
    addDevice(name: string, nd: NetworkDevice) {
        let d: DeviceConfig;
        d = this.getDeviceByUuid(nd.uuid);
        if (d) {
            throw new DeviceAlreadyAddedException();
        }
        d = this.getDeviceByName(name);
        if (d) {
            throw new DuplicateDeviceNameException();
        }
        d = {
            name,
            deviceMeta: nd,
        };
        this.state.devices.push(d);
        this.saveDB();
        return d;
    }
    removeDeviceByUuid(uuid: string) {
        const deviceIndex = this.state.devices.findIndex(
            (d) => d.deviceMeta.uuid === uuid
        );
        if (deviceIndex < 0) {
            throw new NotFoundException("Device is not added to database yet!");
        }
        return this.removeDeviceAt(deviceIndex);
    }
    removeDeviceByName(name: string) {
        const deviceIndex = this.state.devices.findIndex((d) => d.name === name);
        if (deviceIndex < 0) {
            throw new NotFoundException("Device is not added to database yet!");
        }
        return this.removeDeviceAt(deviceIndex);
    }
    private removeDeviceAt(index: number) {
        const d = this.state.devices.splice(index, 1)[0];
        this.saveDB();
        return d;
    }
}

export interface DeviceConfig {
    name: string;
    deviceMeta: NetworkDevice;
}

export const DatabaseInstance = new Database("./data");
