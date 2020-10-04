export enum ProgramPatchType {
    CREATE_NODE,
    TRANSLATE_NODE,
    CONNECT_SOCKETS,
    UPDATE_NODE_SETTING,
    DISCONNECT_SOCKETS,
}

export type CreateNodePatch = {
    type: ProgramPatchType.CREATE_NODE,
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

export type ProgramPatch = CreateNodePatch | TranslateNodePatch | ConnectSocketsPatch | DisconnectSocketsPatch | UpdateNodeSettingsPatch;
