import Program from "./Program";
import { EventEmitter } from "events";
import throttle from "lodash.throttle";
import { v4 as uuid } from 'uuid';

import VisualNodesCore, { CoreEventsTypes, ProgramDefinition, ProgramNode } from "..";
import { Point } from "../types/Point";
import { ProgramPatch, ProgramPatchType } from "./ProgramPatch";

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

        this.applyPatch({
            type: ProgramPatchType.CREATE_NODE,
            node: newId,
            payload: {
                componentId: component.id,
                position,
            },
        });

        return true;
    }

    moveNode(nodeId: string, { diffX, diffY }: { diffX: number, diffY: number }) {
        if (!this.#moveCache[nodeId]) {
            this.#moveCache[nodeId] = {
                x: 0,
                y: 0,
                throttle: throttle(() => {
                    this.applyPatch({
                        type: ProgramPatchType.TRANSLATE_NODE,
                        node: nodeId,
                        payload: {
                            x: this.#moveCache[nodeId].x,
                            y: this.#moveCache[nodeId].y,
                        },
                    });

                    this.#moveCache[nodeId].x = 0;
                    this.#moveCache[nodeId].y = 0;
                }, 25),
            }
        }

        this.#moveCache[nodeId].x += diffX;
        this.#moveCache[nodeId].y += diffY;
        this.#moveCache[nodeId].throttle();
    }

    updateNodeSetting(nodeId: string, key: string, value: any) {
        this.applyPatch({
            type: ProgramPatchType.UPDATE_NODE_SETTING,
            node: nodeId,
            payload: {
                key,
                value,
            },
        });

        this.#events.emit('update-node', { node: nodeId });
    }

    applyPatch(patch: ProgramPatch): boolean {
        const retVal = super.applyPatch(patch);

        this.#events.emit('apply-patch', { patch });

        switch(patch.type) {
            case ProgramPatchType.CREATE_NODE:
            case ProgramPatchType.CONNECT_SOCKETS:
                this.#events.emit('update-program');
                break;
            case ProgramPatchType.UPDATE_NODE_SETTING:
            case ProgramPatchType.TRANSLATE_NODE:
                this.#events.emit('update-node', { node: patch.node });
                break;
        }

        return retVal;
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

        this.applyPatch({
            type: ProgramPatchType.CONNECT_SOCKETS,
            payload: {
                input: {
                    node: node1.node,
                    socket: node1.socket,
                    exclusive: !node1Socket.multiple,
                },
                output: {
                    node: node2.node,
                    socket: node2.socket,
                    exclusive: !node2Socket.multiple,
                },
            },
        });

        return true;
    }

    get events() {
        return this.#events;
    }
}
