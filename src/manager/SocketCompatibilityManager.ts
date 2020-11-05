import Manager, { DefinitionDependency, ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { SocketCompatibilityDefinition } from "../types/SocketCompatibilityDefinition";

export default class SocketCompatibilityManager extends Manager<SocketCompatibilityDefinition> {
    #compatibilityMap: { [fromSocket: string]: string } = {};

    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_SOCKET_COMPATIBILITY_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_SOCKET_COMPATIBILITY_DEFINITION,
        });
    }

    protected async registerInternal(definition: SocketCompatibilityDefinition, dependencies:DefinitionDependency) {
        await super.registerInternal(definition, dependencies);

        this.#compatibilityMap[definition.from] = definition.to;
    }

    isCompatible(from: string, to: string): boolean {
        if (!this.#compatibilityMap[from]) {
            return false;
        }

        return this.#compatibilityMap[from] === to;
    }
}
