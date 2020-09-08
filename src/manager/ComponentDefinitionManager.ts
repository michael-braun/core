import Manager, { ManagerEvent } from "./Manager";
import { ComponentDefinition } from "../types/ComponentDefinition";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";

export default class ComponentDefinitionManager extends Manager<ComponentDefinition> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_COMPONENT_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_COMPONENT_DEFINITION,
        });
    }
}
