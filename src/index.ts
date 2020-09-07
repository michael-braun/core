import ComponentDefinitionManager from "./manager/ComponentDefinitionManager";
import CustomEventEmitter from "./manager/CustomEventManager";
import SocketDefinitionManager from "./manager/SocketDefinitionManager";
import ControlDefinitionManager from "./manager/ControlDefinitionManager";
import ConfigDefinitionManager from "./manager/ConfigDefinitionManager";
import PluginManager from "./manager/PluginManager";

export * from './types/ComponentDefinition';
export * from './types/ConfigDefinition';
export * from './types/ControlDefinition';
export * from './types/SocketDefinition';
export { CoreEvents } from './types/CoreEvents';

export default class VisualNodesCore {
    readonly #events = new CustomEventEmitter();

    readonly #componentDefinitions = new ComponentDefinitionManager(this);

    readonly #socketDefinitions = new SocketDefinitionManager(this);

    readonly #controlDefinitions = new ControlDefinitionManager(this);

    readonly #configDefinitions = new ConfigDefinitionManager(this);

    readonly #plugins = new PluginManager(this);



    get events(): CustomEventEmitter {
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

    get plugins(): PluginManager {
        return this.#plugins;
    }
}
