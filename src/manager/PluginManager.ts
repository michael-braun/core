import Manager, { DefinitionDependency, ManagerEvent } from "./Manager";
import VisualNodesCore, { CoreEvents, CoreEventsTypes } from "../index";
import { Plugin, PluginContext } from "../types/Plugin";

export default class PluginManager<T extends PluginContext> extends Manager<Plugin<T>> {
    constructor(core: VisualNodesCore<CoreEventsTypes>) {
        super(core, {
            [ManagerEvent.REGISTER]: CoreEvents.INSTALL_PLUGIN,
            [ManagerEvent.REGISTERED]: CoreEvents.INSTALLED_PLUGIN,
        });
    }

    protected async registerInternal(definition: Plugin<T>, dependencies?: DefinitionDependency) {
        const ctx = {
            core: this.core,
        };

        await this.core.events.emitResponse(CoreEvents.CREATE_PLUGIN_CONTEXT, {
            plugin: definition.plugin,
            ctx,
        });

        await definition.install(ctx as T);

        return super.registerInternal(definition, dependencies);
    }
}
