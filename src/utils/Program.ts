import { Config, ProgramDefinition, ProgramNode } from "..";
import { ProgramPatch, ProgramPatchType } from "./ProgramPatch";

export type ConnectionInfo = {
    output: {
        node: string;
        socket: string;
    },
    input: {
        node: string;
        socket: string;
    }
}

export default class Program {
    protected program: ProgramDefinition;

    #nodeCache: ProgramNode[] | null = null;

    #connectionCache: ConnectionInfo[] | null = null;

    #configCache: { [type: string]: any[] } = {};

    constructor(program: ProgramDefinition) {
        this.program = program;
    }

    getNodes() {
        if (!this.#nodeCache) {
            this.#nodeCache = Object.values(this.program.nodes);
        }

        return this.#nodeCache;
    }

    getNode(id: string): ProgramNode {
        return this.program.nodes[id];
    }

    updateNode(id: string, cb: (node: ProgramNode) => ProgramNode) {
        const newNode = cb(this.program.nodes[id]);

        if (newNode) {
            this.program = {
                ...this.program,
                nodes: {
                    ...this.program.nodes,
                    [id]: newNode,
                },
            }
            this.invalidateCache();
        }
    }

    getConnections() {
        if (!this.#connectionCache) {
            const cache: ConnectionInfo[] = [];
            this.getNodes()?.forEach((node) => {
                Object.entries(node.outputs).forEach(([output, connections]) => {
                    connections.connections.forEach((connection) => {
                        cache.push({
                            output: {
                                node: String(node.id),
                                socket: output,
                            },
                            input: {
                                node: String(connection.node),
                                socket: connection.input
                            }
                        });
                    });
                });
            });
            this.#connectionCache = cache;
        }

        return this.#connectionCache;
    }

    getConfigsByType<T>(type: string): Config<T>[] {
        if (!this.#configCache[type]) {
            if (this.program.configs?.[type]) {
                this.#configCache[type] = Object.values(this.program.configs[type]);
            } else {
                this.#configCache[type] = [];
            }
        }

        return this.#configCache[type];
    }

    getConfig<T>(type: string, id: string): Config<T> | null {
        return this.program.configs[type]?.[id] || null;
    }

    applyPatch(patch: ProgramPatch): boolean {
        switch (patch.type) {
            case ProgramPatchType.CREATE_NODE:
                this.program = {
                    ...this.program,
                    nodes: {
                        ...this.program.nodes,
                        [patch.node]: {
                            id: patch.node,
                            name: patch.payload.componentId,
                            inputs: {},
                            outputs: {},
                            data: {},
                            position: [patch.payload.position.x, patch.payload.position.y],
                        },
                    },
                };

                this.invalidateCache();
                return true;
            case ProgramPatchType.TRANSLATE_NODE:
                this.updateNode(patch.node, (node) => ({
                    ...node,
                    position: [
                        node.position[0] + patch.payload.x,
                        node.position[1] + patch.payload.y,
                    ],
                }));

                this.invalidateCache();
                return true;
            case ProgramPatchType.UPDATE_NODE_SETTING:
                this.updateNode(patch.node, (node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        [patch.payload.key]: patch.payload.value,
                    },
                }));

                this.invalidateCache();
                return true;
            case ProgramPatchType.CONNECT_SOCKETS:
                this.updateNode(patch.payload.input.node, (programNode: ProgramNode) => {
                    let outputConnections = (programNode.outputs[patch.payload.input.socket]?.connections || []);
                    if (patch.payload.input.exclusive) {
                        outputConnections = [];
                    }

                    return {
                        ...programNode,
                        outputs: {
                            ...programNode.outputs,
                            [patch.payload.input.socket]: {
                                connections: [...outputConnections, {
                                    node: patch.payload.output.node,
                                    input: patch.payload.output.socket,
                                }],
                            }
                        }
                    }
                });

                this.updateNode(patch.payload.output.node, (programNode: ProgramNode) => {
                    let inputConnections = (programNode.inputs[patch.payload.output.socket]?.connections || []);
                    if (patch.payload.output.exclusive) {
                        inputConnections = [];
                    }

                    return {
                        ...programNode,
                        inputs: {
                            ...programNode.inputs,
                            [patch.payload.output.socket]: {
                                connections: [...inputConnections, {
                                    node: patch.payload.input.node,
                                    output: patch.payload.input.socket,
                                }],
                            }
                        }
                    }
                });

                return true;
            case ProgramPatchType.DISCONNECT_SOCKETS:
                this.updateNode(patch.payload.input.node, (node) => {
                    return ({
                        ...node,
                        outputs: {
                            ...node.outputs,
                            [patch.payload.input.socket]: {
                                connections: node.outputs[patch.payload.input.socket].connections.filter((c) => {
                                    return String(c.node) !== String(patch.payload.output.node) || c.input !== patch.payload.output.socket;
                                }),
                            }
                        }
                    })
                });

                this.updateNode(patch.payload.output.node, (node) => ({
                    ...node,
                    inputs: {
                        ...node.inputs,
                        [patch.payload.output.socket]: {
                            connections: node.inputs[patch.payload.output.socket].connections.filter((c) => {
                                return String(c.node) !== String(patch.payload.input.node) && c.output !== patch.payload.input.socket;
                            }),
                        }
                    }
                }));

                this.invalidateCache();
                return true;
            case ProgramPatchType.DELETE_NODE:
                const newProgram = {
                    ...this.program,
                    nodes: {
                        ...this.program.nodes,
                    }
                };

                delete newProgram.nodes[patch.node];

                this.program = newProgram;

                this.invalidateCache();
                return true;
            case ProgramPatchType.CREATE_CONFIG:
                this.program = {
                    ...this.program,
                    configs: {
                        ...this.program.configs,
                        [patch.payload.configDefinitionId]: {
                            ...(this.program.configs[patch.payload.configDefinitionId] || {}),
                            [patch.payload.id]: {
                                id: patch.payload.id,
                                name: patch.payload.name,
                                value: patch.payload.value,
                            }
                        }
                    }
                }

                this.invalidateCache();
                return true;
            case ProgramPatchType.UPDATE_CONFIG:
                this.program = {
                    ...this.program,
                    configs: {
                        ...this.program.configs,
                        [patch.payload.configDefinitionId]: {
                            ...(this.program.configs[patch.payload.configDefinitionId] || {}),
                            [patch.payload.id]: {
                                ...(this.program.configs[patch.payload.configDefinitionId][patch.payload.id] || {}),
                                value: patch.payload.value,
                            }
                        }
                    }
                }

                this.invalidateCache();
                return true;
            default:
                return false;
        }
    }

    toJSON() {
        return this.program;
    }

    protected invalidateCache() {
        this.#nodeCache = null;
        this.#connectionCache = null;
        this.#configCache = {};
    }
}
