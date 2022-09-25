declare type DefaultListener = {
    [k: string]: (...args: any) => any | Promise<any>;
};
declare type ListenerSignature<M> = {
    [K in keyof M]: (...args: any) => void | Promise<void>;
};
declare type HookallCallback<M extends ListenerSignature<M>, K extends keyof M> = (...args: Parameters<M[K]>) => void | Promise<void>;
declare type HookallCallbackMap<M extends ListenerSignature<M>> = Map<string | number | symbol, HookallCallback<M, keyof M>[]>;
declare class Hookall<M extends ListenerSignature<M>> {
    static readonly Global: {};
    private static readonly _Store;
    protected readonly _command: HookallCallbackMap<M>;
    /**
     * Create hook system. you can pass a target object or undefined.
     * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
     * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
     * @param target The object to work with locally. If not specified, will be work for global.
     */
    constructor(target: object);
    private _ensureCommand;
    /**
     * Register the callback function. Registered functions can then be called past the same command with the `trigger` method.
     * The parameters of the callback function are those passed when calling the `trigger` method.
     * @param command The unique key for call `off` or `trigger`.
     * @param callback The callback function.
     */
    on<K extends keyof M>(command: K, callback: M[K]): this;
    /**
     * Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.
     * @param command The unique key from `on`.
     * @param callback The callback function. If not specified, all callback functions will be removed.
     */
    off<K extends keyof M>(command: K, callback?: M[K] | null): this;
    /**
     * Invokes all callback functions registered with the on method. The callback function is called in the registered order and can operate asynchronously.
     * Therefore, the `await` keyword allows you to wait until all registered callback functions are called.
     * @param command The unique key from `on`.
     * @param args pass arguments to the callback function.
     * @returns
     */
    trigger<K extends keyof M>(command: K, ...args: Parameters<M[K]>): Promise<void>;
}
/**
 * Create hook system. you can pass a target object or undefined.
 * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
 * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
 * @param target The object to work with locally. If not specified, will be work for global. Default is `Hookall.Global`.
 */
export declare function useHookall<M extends ListenerSignature<M> = DefaultListener>(target?: object): Hookall<M>;
export {};
