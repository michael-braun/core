import { OutputSocketConnection, ProgramDefinition, ProgramNode, SocketConnection, SocketConnections } from "..";

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

    protected invalidateCache() {
        this.#nodeCache = null;
        this.#connectionCache = null;
    }
}
