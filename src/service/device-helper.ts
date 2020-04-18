import { wait } from "../utils/wait";
import {
    OutOfRangeException,
    InvalidArgumentException,
    ArgumentFormatException,
    NetworkDeviceNotFoundException,
    UnknownDeviceException,
    InvalidActionException,
} from "../utils/errors";
import { isValidColorString } from "../utils/validators";

export interface NetworkDevice {
    type: DeviceType;
    ip: string;
    servicePort: number;
    uuid: string;
}

export abstract class SmartDevice {
    protected actions: {
        [key: string]: (
            args: any
            // | PowerState
            // | number
            // | AcMode
            // | AcSwing
            // | AcFanSpeed
            // | TvKeys
            // | string
        ) => Promise<boolean>;
    } = {};
    constructor(protected networkDevice: NetworkDevice) {}
    abstract setPowerState(state: PowerState): Promise<boolean>;

    performAction(action: string, args?: any): Promise<boolean> {
        if (!this.actions[action]) {
            throw new InvalidActionException(action);
        }
        return this.actions[action].call(this, args);
    }

    abstract getState(): any;
}

export class SmartAC extends SmartDevice {
    private state: {
        temp: number;
        mode: AcMode;
        fanSpeed: AcFanSpeed;
        swing: AcSwing;
        powerState: PowerState;
    } = null;
    constructor(networkDevice: NetworkDevice) {
        super(networkDevice);
        this.state = {
            temp: 28,
            mode: AcMode.AUTO,
            fanSpeed: AcFanSpeed.AUTO,
            swing: AcSwing.AUTO,
            powerState: PowerState.OFF,
        };
        this.actions.setTemperature = this.setTemperature;
        this.actions.setMode = this.setMode;
        this.actions.setFanSpeed = this.setFanSpeed;
        this.actions.setSwing = this.setSwing;
        this.actions.setPowerState = this.setPowerState;
    }

    getState() {
        return this.state;
    }

    async setTemperature(temp: number): Promise<boolean> {
        if (!temp || temp < 18 || temp > 32) {
            throw new OutOfRangeException(18, 32);
        }
        // Mock device communication
        await wait(300);
        this.state.temp = temp;
        return true;
    }

    async setMode(mode: AcMode): Promise<boolean> {
        if (!mode || !AcMode[mode]) {
            throw new InvalidArgumentException(Object.keys(AcMode));
        }
        // Mock device communication
        await wait(300);
        this.state.mode = mode;
        return true;
    }

    async setFanSpeed(speed: AcFanSpeed): Promise<boolean> {
        if (!speed || !AcFanSpeed[speed]) {
            throw new InvalidArgumentException(Object.keys(AcFanSpeed));
        }
        // Mock device communication
        await wait(300);
        this.state.fanSpeed = speed;
        return true;
    }

    async setSwing(swing: AcSwing): Promise<boolean> {
        if (!swing || !AcSwing[swing]) {
            throw new InvalidArgumentException(Object.keys(AcSwing));
        }
        // Mock device communication
        await wait(300);
        this.state.swing = swing;
        return true;
    }

    async setPowerState(state: PowerState): Promise<boolean> {
        if (!state || !PowerState[state]) {
            throw new InvalidArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return true;
    }
}

export class SmartTV extends SmartDevice {
    private state: {
        powerState: PowerState;
        volume: number;
        isMuted: boolean;
    } = null;
    constructor(networkDevice: NetworkDevice) {
        super(networkDevice);
        this.state = {
            powerState: PowerState.OFF,
            volume: 35,
            isMuted: false,
        };
        this.actions.setVolume = this.setVolume;
        this.actions.toggleMute = this.toggleMute;
        this.actions.setPowerState = this.setPowerState;
        this.actions.keyPress = this.keyPress;
    }

    getState() {
        return this.state;
    }

    async setVolume(vol: number): Promise<boolean> {
        if (!vol || vol < 0 || vol > 100) {
            throw new OutOfRangeException(0, 100);
        }
        // Mock device communication
        await wait(300);
        this.state.volume = vol;
        return true;
    }

    async toggleMute(): Promise<boolean> {
        // Mock device communication
        await wait(300);
        this.state.isMuted = !this.state.isMuted;
        return this.state.isMuted;
    }

    async setPowerState(state: PowerState): Promise<boolean> {
        if (!state || !PowerState[state]) {
            throw new InvalidArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return true;
    }

    async keyPress(key: TvKeys): Promise<boolean> {
        if (!key || !TvKeys[key]) {
            throw new InvalidArgumentException(Object.keys(TvKeys));
        }

        switch (key) {
            case TvKeys.Mute:
                return this.toggleMute();
            case TvKeys.VolumeDown:
                return this.setVolume(this.state.volume - 1);
            case TvKeys.VolumeUp:
                return this.setVolume(this.state.volume + 1);
            case TvKeys.TvPower:
                this.setPowerState(
                    this.state.powerState === PowerState.ON
                        ? PowerState.OFF
                        : PowerState.ON
                );
                return true;
            default:
                // Mock device communication
                await wait(300);
                return true;
        }
    }
}

export class SmartLight extends SmartDevice {
    private state: {
        powerState: PowerState;
        color: string;
        brightness: number;
    } = null;
    constructor(networkDevice: NetworkDevice) {
        super(networkDevice);
        this.state = {
            powerState: PowerState.OFF,
            color: "#FFFFFF",
            brightness: 75,
        };

        this.actions.setBrightness = this.setBrightness;
        this.actions.setColor = this.setColor;
        this.actions.setPowerState = this.setPowerState;
    }

    getState() {
        return this.state;
    }
    async setBrightness(brightness: number): Promise<boolean> {
        if (!brightness || brightness < 0 || brightness > 100) {
            throw new OutOfRangeException(0, 100);
        }
        // Mock device communication
        await wait(300);
        this.state.brightness = brightness;
        return true;
    }

    async setColor(color: string): Promise<boolean> {
        if (!isValidColorString(color)) {
            throw new ArgumentFormatException(["Hex Color String"]);
        }
        // Mock device communication
        await wait(300);
        this.state.color = color;
        return true;
    }

    async setPowerState(state: PowerState): Promise<boolean> {
        if (!state || !PowerState[state]) {
            throw new InvalidArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return true;
    }
}

export enum DeviceType {
    "AC" = "AC",
    "TV" = "TV",
    "Light" = "Light",
}
export enum PowerState {
    "ON" = "ON",
    "OFF" = "OFF",
}
export enum AcMode {
    "COOL" = "COOL",
    "FAN" = "FAN",
    "HEAT" = "HEAT",
    "DRY" = "DRY",
    "AUTO" = "AUTO",
}
export enum AcFanSpeed {
    "HIGH" = "HIGH",
    "MEDIUM" = "MEDIUM",
    "LOW" = "LOW",
    "AUTO" = "AUTO",
}
export enum AcSwing {
    "S30" = "S30",
    "S45" = "S45",
    "S60" = "S60",
    "AUTO" = "AUTO",
    "OFF" = "OFF",
}
export enum TvKeys {
    "Num1" = "Num1",
    "Num2" = "Num2",
    "Num3" = "Num3",
    "Num4" = "Num4",
    "Num5" = "Num5",
    "Num6" = "Num6",
    "Num7" = "Num7",
    "Num8" = "Num8",
    "Num9" = "Num9",
    "Num0" = "Num0",
    "VolumeUp" = "VolumeUp",
    "VolumeDown" = "VolumeDown",
    "Mute" = "Mute",
    "Right" = "Right",
    "Left" = "Left",
    "Up" = "Up",
    "Down" = "Down",
    "ChannelUp" = "ChannelUp",
    "ChannelDown" = "ChannelDown",
    "Confirm" = "Confirm",
    "Return" = "Return",
    "Red" = "Red",
    "Green" = "Green",
    "Yellow" = "Yellow",
    "Blue" = "Blue",
    "GGuide" = "GGuide",
    "Home" = "Home",
    "Rec" = "Rec",
    "Tv" = "Tv",
    "Rewind" = "Rewind",
    "Pause" = "Pause",
    "Forward" = "Forward",
    "TvPower" = "TvPower",
}

const MOCK_DEVICES: NetworkDevice[] = [
    {
        type: DeviceType.AC,
        ip: "192.168.1.33",
        servicePort: 10203,
        uuid: "3eda6aad-f9f7-45f5-a6e3-1219a15cc82a",
    },
    {
        type: DeviceType.AC,
        ip: "192.168.1.34",
        servicePort: 10203,
        uuid: "4e1cb033-d3c1-4a2d-8f0c-9cbce2a129c9",
    },
    {
        type: DeviceType.TV,
        ip: "192.168.1.35",
        servicePort: 80,
        uuid: "3a96dede-481e-4a54-992d-6f6580185902",
    },
    {
        type: DeviceType.Light,
        ip: "192.168.1.36",
        servicePort: 3001,
        uuid: "f82190bd-8c5f-48d2-bcf2-893b1f05f22d",
    },
    {
        type: DeviceType.Light,
        ip: "192.168.1.37",
        servicePort: 3001,
        uuid: "5f92fcd8-322b-4c23-a562-0d6134a55c8c",
    },
    {
        type: DeviceType.Light,
        ip: "192.168.1.38",
        servicePort: 3001,
        uuid: "0510bf58-3039-45e2-95c3-58c8fb202c28",
    },
    {
        type: DeviceType.Light,
        ip: "192.168.1.39",
        servicePort: 3001,
        uuid: "65f6e76f-eac5-4cf5-82b6-95c9ae18c25f",
    },
];

const DEVICE_CONNECTIONS: { [key: string]: SmartDevice } = {};

export class DeviceHelper {
    async findDevices(): Promise<NetworkDevice[]> {
        await wait(5 * 1000);
        return MOCK_DEVICES;
    }

    async getDeviceConnection(uuid: string): Promise<SmartDevice> {
        let sd: SmartDevice;
        // Check if connection already exists
        sd = DEVICE_CONNECTIONS[uuid];

        if (!sd) {
            // Mock device validation on network
            await wait(100);
            const nd = MOCK_DEVICES.find((el) => el.uuid === uuid);
            if (!nd) {
                throw new NetworkDeviceNotFoundException();
            }

            // Mock connection establish attempt
            await wait(100);
            switch (nd.type) {
                case "AC":
                    sd = new SmartAC(nd);
                    break;
                case "Light":
                    sd = new SmartLight(nd);
                    break;
                case "TV":
                    sd = new SmartTV(nd);
                    break;
                default:
                    throw new UnknownDeviceException();
            }
            DEVICE_CONNECTIONS[uuid] = sd;
        }
        return sd;
    }
}

export const DeviceHelperInstance = new DeviceHelper();
