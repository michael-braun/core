import Manager, { DefinitionDependency, ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { Plugin } from "../types/Plugin";
import BaseManager from "./BaseManager";
import { deepFreeze } from "../utils/deepFreeze";

export interface FeatureSupportDefinition {
    id: string;
}

export default class FeatureSupportManager extends BaseManager<FeatureSupportDefinition> {
    async register(definition: FeatureSupportDefinition) {
        if (this.has(definition.id)) {
            return false;
        }

        await this.core.events.emitResponse(CoreEvents.REGISTER_FEATURE_SUPPORT, {
            id: definition.id,
        });

        deepFreeze(definition);

        await this.add(definition);
        this.invalidateCache();

        this.core.events.emit(CoreEvents.REGISTERED_FEATURE_SUPPORT, {
            id: definition.id,
        });

        return true;
    }
}
