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

    connectSockets(node1: NodeSocket, node2: NodeSocket) {
        this.updateNode(node1.node, (programNode: ProgramNode) => {
            return {
                ...programNode,
                outputs: {
                    ...programNode.outputs,
                    [node1.socket]: {
                        connections: [...(programNode.outputs[node1.socket]?.connections || []), {
                            node: node2.node,
                            input: node2.socket,
                        }],
                    }
                }
            }
        });

        this.updateNode(node1.node, (programNode: ProgramNode) => {
            return {
                ...programNode,
                inputs: {
                    ...programNode.inputs,
                    [node2.socket]: {
                        connections: [...(programNode.inputs[node2.socket]?.connections || []), {
                            node: node1.node,
                            output: node1.socket,
                        }],
                    }
                }
            }
        });

        this.#events.emit('update-program');
    }

    get events() {
        return this.#events;
    }
}
