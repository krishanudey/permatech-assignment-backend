import { wait } from "../utils/wait";
import {
    OutOfRangeException,
    IlligalArgumentException,
    ArgumentFormatException,
} from "../utils/errors";
import { isValidColorString } from "../utils/validators";

const MOCK_DEVICES: NetworkDevice[] = [
    {
        type: "AC",
        ip: "192.168.1.33",
        servicePort: 10203,
        uuid: "",
    },
    {
        type: "AC",
        ip: "192.168.1.34",
        servicePort: 10203,
        uuid: "",
    },
    {
        type: "TV",
        ip: "192.168.1.35",
        servicePort: 80,
        uuid: "",
    },
    {
        type: "Light",
        ip: "192.168.1.36",
        servicePort: 3001,
        uuid: "",
    },
    {
        type: "Light",
        ip: "192.168.1.37",
        servicePort: 3001,
        uuid: "",
    },
    {
        type: "Light",
        ip: "192.168.1.38",
        servicePort: 3001,
        uuid: "",
    },
    {
        type: "Light",
        ip: "192.168.1.39",
        servicePort: 3001,
        uuid: "",
    },
];

export class DeviceHelper {
    async findDevices(): Promise<NetworkDevice[]> {
        await wait(5 * 1000);
        return MOCK_DEVICES;
    }

    getDeviceConnection(uuid: string) {
        return;
    }
}

export interface NetworkDevice {
    type: "AC" | "TV" | "Light";
    ip: string;
    servicePort: number;
    uuid: string;
}

export abstract class SmartDevice {
    constructor(protected networkDevice: NetworkDevice) {}
    abstract setPowerState(state: PowerState): Promise<PowerState>;
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
    }

    async setTemperature(temp: number): Promise<number> {
        if (temp < 18 || temp > 32) {
            throw new OutOfRangeException(18, 32);
        }
        // Mock device communication
        await wait(300);
        this.state.temp = temp;
        return temp;
    }

    async setMode(mode: AcMode): Promise<AcMode> {
        if (!mode) {
            throw new IlligalArgumentException(Object.keys(AcMode));
        }
        // Mock device communication
        await wait(300);
        this.state.mode = mode;
        return mode;
    }

    async setFanSpeed(speed: AcFanSpeed): Promise<AcFanSpeed> {
        if (!speed) {
            throw new IlligalArgumentException(Object.keys(AcFanSpeed));
        }
        // Mock device communication
        await wait(300);
        this.state.fanSpeed = speed;
        return speed;
    }

    async setSwing(swing: AcSwing): Promise<AcSwing> {
        if (!swing) {
            throw new IlligalArgumentException(Object.keys(AcSwing));
        }
        // Mock device communication
        await wait(300);
        this.state.swing = swing;
        return swing;
    }

    async setPowerState(state: PowerState): Promise<PowerState> {
        if (!state) {
            throw new IlligalArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return state;
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
    }

    async setVolume(vol: number): Promise<boolean> {
        if (vol < 0 || vol > 100) {
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

    async setPowerState(state: PowerState): Promise<PowerState> {
        if (!state) {
            throw new IlligalArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return state;
    }

    async keyPress(key: TvKeys): Promise<boolean> {
        if (!key) {
            throw new IlligalArgumentException(Object.keys(TvKeys));
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
    }

    async setBrightness(brightness: number): Promise<boolean> {
        if (brightness < 0 || brightness > 100) {
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

    async setPowerState(state: PowerState): Promise<PowerState> {
        if (!state) {
            throw new IlligalArgumentException(Object.keys(PowerState));
        }
        // Mock device communication
        await wait(300);
        this.state.powerState = state;
        return state;
    }
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
