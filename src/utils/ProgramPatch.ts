export enum ProgramPatchType {
    CREATE_NODE,
    TRANSLATE_NODE,
    CONNECT_SOCKETS,
    UPDATE_NODE_SETTING,
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

export type UpdateNodeSettingsPatch = {
    type: ProgramPatchType.UPDATE_NODE_SETTING;
    node: string;
    payload: {
        key: string;
        value: string;
    };
};

export type ProgramPatch = CreateNodePatch | TranslateNodePatch | ConnectSocketsPatch | UpdateNodeSettingsPatch;
