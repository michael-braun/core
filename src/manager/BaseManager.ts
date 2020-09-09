import VisualNodesCore, { CoreEventsTypes } from "../index";
import { deepFreeze } from "../utils/deepFreeze";
import { DefinitionDependency, ManagerEvent, ManagerEventConfig } from "./Manager";
import { IBaseDefinition } from "../types/interfaces/IBaseDefinition";

export default class BaseManager<T extends IBaseDefinition> {
    protected readonly definitions: { [key: string]: T } = {};

    protected definitionsArray: T[] | null = null;

    readonly #core: VisualNodesCore<CoreEventsTypes>;

    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        this.#core = core;
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

    protected add(definition: T): void {
        this.definitions[definition.id] = definition;
        this.invalidateCache();
    }

    protected get core(): VisualNodesCore<CoreEventsTypes> {
        return this.#core;
    }
}
