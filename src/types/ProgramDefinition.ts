export type SocketConnection = {
    node: number | string;
};

export type OutputSocketConnection = SocketConnection & {
    input: string;
};

export type InputSocketConnection = SocketConnection & {
    output: string;
};

export type SocketConnections<T extends SocketConnection> = {
    [key: string]: {
        connections: T[],
    }
}

export type Config<T> = {
    id: string;
    name: string;
    value: T;
}

export type ConfigData = { [definitionId: string]: { [id: string]: Config<any> } };

export type ProgramNode = {
    id: number | string;
    data: { [key: string]: any };
    inputs: SocketConnections<InputSocketConnection>,
    outputs: SocketConnections<OutputSocketConnection>,
    name: string,
    position: [number, number],
};

export type ProgramDefinition = {
    id: string;
    nodes: { [id: string]: ProgramNode },
    configs: ConfigData,
}
