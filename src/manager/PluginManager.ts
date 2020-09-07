import Manager, { ManagerEvent } from "./Manager";
import VisualNodesCore from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { Plugin } from "../types/Plugin";

export default class PluginManager extends Manager<Plugin> {
    constructor(core: VisualNodesCore) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.INSTALL_PLUGIN,
            [ManagerEvent.REGISTERED]: CoreEvents.INSTALLED_PLUGIN,
        });
    }
}
