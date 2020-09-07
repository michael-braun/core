import { IDefinition } from "./interfaces/IDefinition";

export interface Plugin extends IDefinition {
    id: string;

    install: () => void;
}
