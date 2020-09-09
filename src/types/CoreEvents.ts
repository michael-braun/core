import { ComponentDefinition } from "./ComponentDefinition";
import { DefinitionDependency } from "../manager/Manager";
import { SocketDefinition } from "./SocketDefinition";
import { ControlDefinition } from "./ControlDefinition";
import { ConfigDefinition } from "./ConfigDefinition";

export enum CoreEvents {
    REGISTER_COMPONENT_DEFINITION = 'registerComponentDefinition',
    REGISTERED_COMPONENT_DEFINITION = 'registeredComponentDefinition',
    REGISTER_SOCKET_DEFINITION = 'registeredSocketDefinition',
    REGISTERED_SOCKET_DEFINITION = 'registeredSocketDefinition',
    REGISTER_CONTROL_DEFINITION = 'registeredControlDefinition',
    REGISTERED_CONTROL_DEFINITION = 'registeredControlDefinition',
    REGISTER_CONFIG_DEFINITION = 'registeredConfigDefinition',
    REGISTERED_CONFIG_DEFINITION = 'registeredConfigDefinition',
    REGISTER_CONFIG_CONTROL_DEFINITION = 'registeredConfigControlDefinition',
    INSTALL_PLUGIN = 'installPlugin',
    INSTALLED_PLUGIN = 'installedPlugin',
    REGISTER_FEATURE_SUPPORT = 'registerFeatureSupport',
    REGISTERED_FEATURE_SUPPORT = 'registeredFeatureSupport',
}

export type DefinitionEvent<T> = {
    id: string,
    plugin: string,
    dependencies: DefinitionDependency | false,
    definition: T,
};

export interface IEvents{
    [key: string]: any;
}

export interface CoreEventsTypes extends IEvents {
    [CoreEvents.REGISTER_COMPONENT_DEFINITION]: DefinitionEvent<ComponentDefinition>;
    [CoreEvents.REGISTERED_COMPONENT_DEFINITION]: DefinitionEvent<ComponentDefinition>;
    [CoreEvents.REGISTER_SOCKET_DEFINITION]: DefinitionEvent<SocketDefinition>;
    [CoreEvents.REGISTERED_SOCKET_DEFINITION]: DefinitionEvent<SocketDefinition>;
    [CoreEvents.REGISTER_CONTROL_DEFINITION]: DefinitionEvent<ControlDefinition>;
    [CoreEvents.REGISTERED_CONTROL_DEFINITION]: DefinitionEvent<ControlDefinition>;
    [CoreEvents.REGISTER_CONFIG_DEFINITION]: DefinitionEvent<ConfigDefinition>;
    [CoreEvents.REGISTERED_CONFIG_DEFINITION]: DefinitionEvent<ConfigDefinition>;
    [CoreEvents.REGISTER_CONFIG_CONTROL_DEFINITION]: {
        id: string,
        plugin: string,
        dependencies: DefinitionDependency | false,
        controlDefinition: ControlDefinition,
        configDefinition: ConfigDefinition,
    };
    [CoreEvents.INSTALL_PLUGIN]: {
        id: string,
    };
    [CoreEvents.INSTALLED_PLUGIN]: {
        id: string,
    };
    [CoreEvents.REGISTER_FEATURE_SUPPORT]: {
        id: string,
    };
    [CoreEvents.REGISTERED_FEATURE_SUPPORT]: {
        id: string,
    };
}
