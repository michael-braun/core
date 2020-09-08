import { IDefinition } from "./interfaces/IDefinition";
import VisualNodesCore, { CoreEventsTypes } from "../index";

export type PluginContext = {
    core: VisualNodesCore<CoreEventsTypes>;
};

export interface Plugin extends IDefinition {
    id: string;

    install: (ctx: PluginContext) => void;
}
