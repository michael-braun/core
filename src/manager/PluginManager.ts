import Manager, { DefinitionDependency, ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEventsTypes } from "../index";
import { CoreEvents } from "../types/CoreEvents";
import { Plugin } from "../types/Plugin";

export default class PluginManager extends Manager<Plugin> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.INSTALL_PLUGIN,
            [ManagerEvent.REGISTERED]: CoreEvents.INSTALLED_PLUGIN,
        });
    }

    protected async registerInternal(definition: Plugin, dependencies?: DefinitionDependency) {
        await definition.install({
            core: this.core,
        });

        return super.registerInternal(definition, dependencies);
    }
}
