import { EventEmitter } from 'events';
import { CoreEvents, CoreEventsTypes } from "../types/CoreEvents";

export default class CustomEventEmitter extends EventEmitter {
    async emitResponse<K extends keyof CoreEventsTypes>(event: K | string, data: CoreEventsTypes[K]): Promise<boolean> {
        const listeners = this.listeners(event);

        for (let i = 0, z = listeners.length; i < z; i += 1) {
            await listeners[i](data);
        }

        return !!listeners.length;
    }

    on<K extends keyof CoreEventsTypes>(event: K | string, callback: (data: CoreEventsTypes[K] | any) => void) {
        return super.on(event, callback);
    }
}
