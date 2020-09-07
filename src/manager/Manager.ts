import { IDefinition } from "../types/interfaces/IDefinition";
import VisualNodesCore from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { deepFreeze } from "../utils/deepFreeze";

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
}

export default class Manager<T extends IDefinition> {
    protected readonly definitions: { [key: string]: T } = {};

    protected readonly definitionDependencies: { [key: string]: DefinitionDependency | false } = {};

    protected definitionsArray: T[] | null = null;

    readonly #core: VisualNodesCore;

    readonly #eventConfig: ManagerEventConfig;

    constructor(core: VisualNodesCore, eventConfig: ManagerEventConfig) {
        this.#core = core;

        this.#eventConfig = eventConfig;
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

        this.definitions[definition.id] = definition;
        this.definitionDependencies[definition.id] = dependencies || false;
        this.invalidateCache();

        this.core.events.emit(this.#eventConfig[ManagerEvent.REGISTERED], {
            id: definition.id,
            plugin: definition.plugin,
            dependencies: dependencies || false,
            definition,
        });

        return true;
    }

    has(id: string): boolean {
        return !!this.definitions[id];
    }

    get(id: string): T | null {
        return this.definitions[id] || null;
    }

    getAll(): T[] {
        if (!this.definitionsArray) {
            this.definitionsArray = Object.values(this.definitions);
            Object.freeze(this.definitionsArray);
        }

        return this.definitionsArray;
    }

    protected invalidateCache(): void {
        this.definitionsArray = null;
    }

    protected get core(): VisualNodesCore {
        return this.#core;
    }
}
