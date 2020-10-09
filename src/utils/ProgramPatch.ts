export enum ProgramPatchType {
    CREATE_NODE,
    TRANSLATE_NODE,
    CONNECT_SOCKETS,
    UPDATE_NODE_SETTING,
    DISCONNECT_SOCKETS,
    DELETE_NODE,
    CREATE_CONFIG,
}

export type CreateNodePatch = {
    type: ProgramPatchType.CREATE_NODE | ProgramPatchType.DELETE_NODE,
    node: string;
    payload: {
        componentId: string;
        position: {
            x: number;
            y: number;
        };
    };
};

export type TranslateNodePatch = {
    type: ProgramPatchType.TRANSLATE_NODE;
    node: string;
    payload: {
        x: number;
        y: number;
    };
};

export type ConnectSocketsPatch = {
    type: ProgramPatchType.CONNECT_SOCKETS;
    payload: {
        input: {
            node: string;
            socket: string;
            exclusive: boolean;
        };
        output: {
            node: string;
            socket: string;
            exclusive: boolean;
        };
    };
};
export type DisconnectSocketsPatch = {
    type: ProgramPatchType.DISCONNECT_SOCKETS;
    payload: {
        input: {
            node: string;
            socket: string;
        };
        output: {
            node: string;
            socket: string;
        };
    };
};

export type UpdateNodeSettingsPatch = {
    type: ProgramPatchType.UPDATE_NODE_SETTING;
    node: string;
    payload: {
        key: string;
        value: string;
    };
};

export type CreateConfigPatch = {
    type: ProgramPatchType.CREATE_CONFIG;
    payload: {
        id: string;
        configDefinitionId: string;
        name: string;
        value: { [key: string]: any };
    };
};

export type ProgramPatch = CreateNodePatch
    | TranslateNodePatch
    | ConnectSocketsPatch
    | DisconnectSocketsPatch
    | UpdateNodeSettingsPatch
    | CreateConfigPatch;
