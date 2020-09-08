import Manager, { ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { SocketDefinition } from "../types/SocketDefinition";

export default class SocketDefinitionManager extends Manager<SocketDefinition> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_SOCKET_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_SOCKET_DEFINITION,
        });
    }

    isActionSocket(id: string) {
        return this.get(id)?.isAction || false;
    }
}
