import { EventEmitter } from 'events';
import { CoreEventsTypes } from "../types/CoreEvents";

type ForceCastString<T> = string;

export default class CustomEventEmitter<T extends CoreEventsTypes> extends EventEmitter {
    async emitResponse<K extends keyof T>(event: K | string, data: T[K]): Promise<boolean> {
        const listeners = this.listeners(event as string);

        for (let i = 0, z = listeners.length; i < z; i += 1) {
            await listeners[i](data);
        }

        return !!listeners.length;
    }

    on<K extends keyof T>(event: ForceCastString<K> | string, callback: (data: T[K]) => void) {
        return super.on(event as string, callback);
    }
}
