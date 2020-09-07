export function deepFreeze<T>(o: T): T {
    Object.freeze(o);
    if (o === undefined) {
        return o;
    }

    Object.getOwnPropertyNames(o).forEach(function (prop) {
        // @ts-ignore
        if (o[prop] !== null
            // @ts-ignore
            && (typeof o[prop] === "object" || typeof o[prop] === "function")
            // @ts-ignore
            && !Object.isFrozen(o[prop])) {
            // @ts-ignore
            deepFreeze(o[prop]);
        }
    });

    return o;
}
