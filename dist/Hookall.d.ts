declare type HookallLifeCycle<K extends string> = `${K}` | `before:${K}` | `after:${K}`;
declare type DefaultListener = {
    [k: string]: (...args: any) => Promise<any>;
};
declare type ListenerSignature<M> = {
    [K in keyof M]: (...args: any) => Promise<any>;
};
declare type HookallCallback<M extends ListenerSignature<M>, K extends keyof M> = (...args: Parameters<M[K]>) => Promise<void | ReturnType<M[K]>>;
declare type HookallCallbackWrapper<M extends ListenerSignature<M>> = {
    callback: HookallCallback<M, keyof M>;
    command: HookallLifeCycle<(keyof M) & string>;
    repeat: number;
};
declare type HookallCallbackMap<M extends ListenerSignature<M>> = Map<string, HookallCallbackWrapper<M>[]>;
export interface IHookall<M extends ListenerSignature<M> = DefaultListener> {
    on<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    once<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    off<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: M[K]): this;
    trigger<K extends keyof M>(command: K & string, ...args: Parameters<M[K]>): Promise<void | ReturnType<M[K]>>;
}
declare class Hookall<M extends ListenerSignature<M>> implements IHookall<M> {
    static readonly Global: {};
    private static readonly __Store;
    protected readonly __hookCommands: HookallCallbackMap<M>;
    /**
     * Create hook system. you can pass a target object or undefined.
     * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
     * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
     * @param target The object to work with locally. If not specified, will be work for global.
     */
    constructor(target: object);
    private _ensureCommand;
    private _createWrapper;
    /**
     * Register the callback function. Registered functions can then be called past the same command with the `trigger` method.
     * The parameters of the callback function are those passed when calling the `trigger` method.
     * If callback function returns `non-undefined`, after callback functions are no longer called.
     * You can manage the life cycle using `before:`, `after:`. If the command is `a`, you can use `before:a` or `after:a`.
     * The life cycle is called in the order of `before:a` ??? `a` ??? `after:a`, and if the `non-undefined` value is returned in life cycle, the next life cycle is not called.
     * @param command The unique key for call `off` or `trigger`.
     * @param callback The callback function.
     */
    on<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    /**
     * Similar to the `on` method, but once called, it is no longer called. The parameters of the callback function are those passed when calling the `trigger` method.
     * If callback function returns `non-undefined`, after callback functions are no longer called.
     * If the current callback is not called by returning a `non-undefined` value from the previous callback, this callback is not deleted.
     * You can manage the life cycle using `before:`, `after:`. If the command is `a`, you can use `before:a` or `after:a`.
     * The life cycle is called in the order of `before:a` ??? `a` ??? `after:a`, and if the `non-undefined` value is returned in life cycle, the next life cycle is not called.
     * @param command The unique key for call `off` or `trigger`.
     * @param callback The callback function.
     */
    once<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    /**
     * Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.
     * You can manage the life cycle using `before:`, `after:`. If the command is `a`, you can use `before:a` or `after:a`.
     * The life cycle is called in the order of `before:a` ??? `a` ??? `after:a`, and if the `non-undefined` value is returned in life cycle, the next life cycle is not called.
     * @param command The unique key from `on`.
     * @param callback The callback function. If not specified, all callback functions will be removed.
     */
    off<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: M[K]): this;
    /**
     * Invokes all callback functions registered with the on method. The callback function is called in the registered order and can operate asynchronously.
     * Therefore, the `await` keyword allows you to wait until all registered callback functions are called.
     * If the callback function registered with the `on` method returns a non `undefined` value, it stops after callback function calls and returns that value.
     * @param command The unique key from `on`.
     * @param args pass arguments to the callback function.
     */
    trigger<K extends keyof M>(command: K & string, ...args: Parameters<M[K]>): Promise<void | ReturnType<M[K]>>;
}
/**
 * Create hook system. you can pass a target object or undefined.
 * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
 * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
 * @param target The object to work with locally. If not specified, will be work for global. Default is `Hookall.Global`.
 */
export declare function useHookall<M extends ListenerSignature<M> = DefaultListener>(target?: object): Hookall<M>;
export {};
