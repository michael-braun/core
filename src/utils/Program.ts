import { ProgramDefinition, ProgramNode } from "..";

export default class Program {
    readonly #program: ProgramDefinition;

    #nodeCache: ProgramNode[] | null = null;

    constructor(program: ProgramDefinition) {
        this.#program = program;
    }

    getNodes() {
        if (!this.#nodeCache) {
            this.#nodeCache = Object.values(this.#program.nodes);
        }

        return this.#nodeCache;
    }

    getNode(id: string): ProgramNode {
        return this.#program.nodes[id];
    }

    private invalidateCache() {
        this.#nodeCache = null;
    }
}
