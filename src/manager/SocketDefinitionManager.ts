import Manager, { ManagerEvent } from "./Manager";
import { ComponentDefinition } from "../types/ComponentDefinition";
import VisualNodesCore from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { SocketDefinition } from "../types/SocketDefinition";

export default class SocketDefinitionManager extends Manager<SocketDefinition> {
    constructor(core: VisualNodesCore) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_SOCKET_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_SOCKET_DEFINITION,
        });
    }
}
