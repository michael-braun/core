import { IDefinition } from "./interfaces/IDefinition";
import VisualNodesCore, { CoreEventsTypes } from "../index";

export type PluginContext = {
    core: VisualNodesCore<CoreEventsTypes>;
};

export interface Plugin<T extends PluginContext> extends IDefinition {
    id: string;

    install: (ctx: T) => void;
}
