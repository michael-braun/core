import { IDefinition } from "./interfaces/IDefinition";

export enum ControlType {
    NORMAL,
    CONFIG,
    CUSTOM,
}
export enum CustomControlType {
    SELECT,
    SELECT_DATA_SOURCE,
}
export enum DataSourceType {
    REQUEST,
}

export enum DataSelectorType {
    CONFIG,
    SINGLE_CONFIG,
}

export type DataSelector = {
    key: string,
    type: DataSelectorType,
    value: any,
};

export type SelectValue = {
    text: string,
    value: string | number,
};

export type CustomControlOptions = {
    type: CustomControlType,
    values?: SelectValue[];
    source?: {
        type: DataSourceType,
        url: string,
    }
};

export interface ControlDefinition extends IDefinition {
    id: string;
    name?: string;
    type?: ControlType,
    initialValue?: any,
    options?: CustomControlOptions,
}

