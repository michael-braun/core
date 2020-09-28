import Program from "./Program";
import { EventEmitter } from "events";
import throttle from "lodash.throttle";
import { v4 as uuid } from 'uuid';

import VisualNodesCore, { CoreEventsTypes, ProgramDefinition, ProgramNode } from "..";
import { Point } from "../types/Point";

type NodeSocket = {
    node: string,
    socket: string,
};

export default class EditableProgram extends Program {
    readonly #events = new EventEmitter();

    readonly #core: VisualNodesCore<any>;

    #moveCache: { [node: string]: { x: number, y: number, throttle: () => void } } = {};

    constructor(core: VisualNodesCore<CoreEventsTypes>, program: ProgramDefinition) {
        super(program);

        this.#core = core;
    }

    createNode(componentId: string, position: Point): boolean {
        const component = this.#core.componentDefinitions.get(componentId);

        if (!component) return false;

        const newId = uuid();

        this.program = {
            ...this.program,
            nodes: {
                ...this.program.nodes,
                [newId]: {
                    id: newId,
                    name: component.id,
                    inputs: {},
                    outputs: {},
                    data: {},
                    position: [position.x, position.y]
                }
            },
        }

        this.#events.emit('update-program');

        this.invalidateCache();

        return true;
    }

    moveNode(nodeId: string, { diffX, diffY }: { diffX: number, diffY: number }) {
        if (!this.#moveCache[nodeId]) {
            this.#moveCache[nodeId] = {
                x: 0,
                y: 0,
                throttle: throttle(() => {
                    this.updateNode(nodeId, (node) => ({
                        ...node,
                        position: [node.position[0] + this.#moveCache[nodeId].x, node.position[1] + this.#moveCache[nodeId].y],
                    }));
                    this.#moveCache[nodeId].x = 0;
                    this.#moveCache[nodeId].y = 0;

                    this.#events.emit('update-node', { node: nodeId });
                }, 25),
            }
        }

        this.#moveCache[nodeId].x += diffX;
        this.#moveCache[nodeId].y += diffY;
        this.#moveCache[nodeId].throttle();
    }

    connectSockets(node1: NodeSocket, node2: NodeSocket): boolean {
        const programNode1 = this.getNode(node1.node);
        const programNode2 = this.getNode(node2.node);

        const node1ComponentDefinition = this.#core.componentDefinitions.get(programNode1.name);
        const node2ComponentDefinition = this.#core.componentDefinitions.get(programNode2.name);

        const node1Socket = node1ComponentDefinition?.outputs?.find(i => i.id === node1.socket);
        const node2Socket = node2ComponentDefinition?.inputs?.find(i => i.id === node2.socket);

        if (!node1Socket || !node2Socket) {
            return false;
        }

        if (!this.#core.socketDefinitions.isCompatible(node1Socket.type, node2Socket.type)) {
            return false;
        }

        this.updateNode(node1.node, (programNode: ProgramNode) => {
            let outputConnections = (programNode.outputs[node1.socket]?.connections || []);
            if (!node1Socket.multiple) {
                outputConnections = [];
            }

            return {
                ...programNode,
                outputs: {
                    ...programNode.outputs,
                    [node1.socket]: {
                        connections: [...outputConnections, {
                            node: node2.node,
                            input: node2.socket,
                        }],
                    }
                }
            }
        });

        this.updateNode(node1.node, (programNode: ProgramNode) => {
            let inputConnections = (programNode.inputs[node2.socket]?.connections || []);
            if (!node2Socket.multiple) {
                inputConnections = [];
            }

            return {
                ...programNode,
                inputs: {
                    ...programNode.inputs,
                    [node2.socket]: {
                        connections: [...inputConnections, {
                            node: node1.node,
                            output: node1.socket,
                        }],
                    }
                }
            }
        });

        this.#events.emit('update-program');

        return true;
    }

    get events() {
        return this.#events;
    }
}
