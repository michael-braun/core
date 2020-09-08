import Manager, { ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { ControlDefinition } from "../types/ControlDefinition";

export default class ControlDefinitionManager extends Manager<ControlDefinition> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_CONTROL_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_CONTROL_DEFINITION,
        });
    }
}
