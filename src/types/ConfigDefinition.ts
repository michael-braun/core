import { IDefinition } from "./interfaces/IDefinition";

export interface ConfigDefinition extends IDefinition {
    id: string;
    name?: string;
    settings: ConfigSettings[];
    ui?: ConfigUi[];
}

export type ConfigSettings = {
    id: string;
    name?: string;
    label?: string;
    type: string;
    defaultValue: any;
}

export type ConfigUi = {
    settingId: string;
    control: string;
}
