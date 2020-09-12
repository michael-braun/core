import { IDefinition } from "../types/interfaces/IDefinition";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { deepFreeze } from "../utils/deepFreeze";
import BaseManager from "./BaseManager";

export enum ManagerEvent {
    REGISTER = 'register',
    REGISTERED = 'registered',
}

export interface ManagerEventConfig {
    [ManagerEvent.REGISTER]: CoreEvents,
    [ManagerEvent.REGISTERED]: CoreEvents,
}

export type DefinitionDependency = {
    plugins?: string[],
    features?: string[],
}

export default class Manager<T extends IDefinition> extends BaseManager<T> {
    protected readonly definitionDependencies: { [key: string]: DefinitionDependency | false } = {};

    readonly #eventConfig: ManagerEventConfig;

    constructor(core: VisualNodesCore<CoreEventsTypes>, eventConfig: ManagerEventConfig) {
        super(core);

        this.#eventConfig = eventConfig;
    }

    protected async registerInternal(definition: T, dependencies?: DefinitionDependency) {
        this.add(definition);
        this.definitionDependencies[definition.id] = dependencies || false;
    }

    async register(definition: T, dependencies?: DefinitionDependency) {
        if (this.has(definition.id)) {
            return false;
        }

        await this.core.events.emitResponse(this.#eventConfig[ManagerEvent.REGISTER], {
            id: definition.id,
            plugin: definition.plugin,
            dependencies: dependencies || false,
            definition,
        });

        deepFreeze(definition);

        await this.registerInternal(definition, dependencies)
        this.invalidateCache();

        this.core.events.emit(this.#eventConfig[ManagerEvent.REGISTERED], {
            id: definition.id,
            plugin: definition.plugin,
            dependencies: dependencies || false,
            definition,
        });

        return true;
    }
}
