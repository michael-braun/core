import ComponentDefinitionManager from "./manager/ComponentDefinitionManager";
import CustomEventEmitter from "./manager/CustomEventManager";
import SocketDefinitionManager from "./manager/SocketDefinitionManager";
import ControlDefinitionManager from "./manager/ControlDefinitionManager";
import ConfigDefinitionManager from "./manager/ConfigDefinitionManager";
import PluginManager from "./manager/PluginManager";
import { CoreEventsTypes } from "./types/CoreEvents";
import FeatureSupportManager from "./manager/FeatureSupportManager";
import { PluginContext } from "./types/Plugin";

export * from './types/ComponentDefinition';
export * from './types/ConfigDefinition';
export * from './types/ControlDefinition';
export * from './types/SocketDefinition';
export * from './types/interfaces/IDefinition';
export { CoreEvents, CoreEventsTypes } from './types/CoreEvents';

export default class VisualNodesCore<T extends CoreEventsTypes> {
    readonly #events = new CustomEventEmitter<T>();

    readonly #componentDefinitions: ComponentDefinitionManager = new ComponentDefinitionManager(this);

    readonly #socketDefinitions = new SocketDefinitionManager(this);

    readonly #controlDefinitions = new ControlDefinitionManager(this);

    readonly #configDefinitions = new ConfigDefinitionManager(this);

    readonly #plugins = new PluginManager(this);

    readonly #featureSupport = new FeatureSupportManager(this);



    get events(): CustomEventEmitter<T> {
        return this.#events;
    }

    get componentDefinitions(): ComponentDefinitionManager {
        return this.#componentDefinitions;
    }

    get socketDefinitions(): SocketDefinitionManager {
        return this.#socketDefinitions;
    }

    get controlDefinitions(): ControlDefinitionManager {
        return this.#controlDefinitions;
    }

    get configDefinitions(): ConfigDefinitionManager {
        return this.#configDefinitions;
    }

    get plugins(): PluginManager<PluginContext> {
        return this.#plugins;
    }

    get featureSupport(): FeatureSupportManager {
        return this.#featureSupport;
    }
}
