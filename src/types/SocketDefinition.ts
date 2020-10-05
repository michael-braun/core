import { IDefinition } from "./interfaces/IDefinition";

export interface SocketDefinition extends IDefinition {
    id: string;
    name: string;
    isAction: boolean;
    color?: string;
}

