import Manager, { ManagerEvent } from "./Manager";
import VisualNodesCore from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { ControlDefinition } from "../types/ControlDefinition";

export default class ControlDefinitionManager extends Manager<ControlDefinition> {
    constructor(core: VisualNodesCore) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_CONTROL_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_CONTROL_DEFINITION,
        });
    }
}
