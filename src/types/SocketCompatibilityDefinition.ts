import { IDefinition } from "./interfaces/IDefinition";

export interface SocketCompatibilityDefinition extends IDefinition {
    id: string;
    from: string;
    to: string;
}
