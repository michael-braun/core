import { IDefinition } from "./interfaces/IDefinition";

export type ComponentDefinitionSocket = {
    id: string;
    name?: string;
    type: string;
    multiple: boolean;
}

export type ComponentDefinitionSetting = {
    id: string;
    type: string;
    options?: {
        name?: string;
        [key: string]: any;
    };
}

export type ComponentDefinitionEntry = {
    name: string;
}

export interface ComponentDefinition extends IDefinition {
    id: string;
    groups?: string[]
    inputs?: ComponentDefinitionSocket[];
    outputs?: ComponentDefinitionSocket[];
    settings?: ComponentDefinitionSetting[];
    entry?: ComponentDefinitionEntry;
}
