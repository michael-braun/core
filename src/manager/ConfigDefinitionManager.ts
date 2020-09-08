import Manager, { DefinitionDependency, ManagerEvent } from "./Manager";
import { ComponentDefinition } from "../types/ComponentDefinition";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { ConfigDefinition } from "../types/ConfigDefinition";
import { ControlDefinition, ControlType } from "../types/ControlDefinition";

export default class ConfigDefinitionManager extends Manager<ConfigDefinition> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.REGISTER_CONFIG_DEFINITION,
            [ManagerEvent.REGISTERED]: CoreEvents.REGISTERED_CONFIG_DEFINITION,
        });
    }

    async register(definition: ConfigDefinition, dependencies?: DefinitionDependency): Promise<boolean> {
        if (!(await super.register(definition, dependencies))) {
            return false;
        }

        let controlDefinition: ControlDefinition = {
            id: definition.id,
            plugin: definition.plugin,
            type: ControlType.CONFIG,
            initialValue: null,
        };

        await this.core.events.emitResponse(CoreEvents.REGISTER_CONFIG_CONTROL_DEFINITION, {
            id: definition.id,
            plugin: definition.plugin,
            dependencies: dependencies || false,
            configDefinition: definition,
            controlDefinition,
        });

        return await this.core.controlDefinitions.register(controlDefinition, dependencies);
    }
}
