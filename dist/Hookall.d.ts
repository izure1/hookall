declare type HookallLifeCycle<K extends string> = K;
declare type DefaultListener = {
    [k: string]: (...args: any) => Promise<any>;
};
declare type ListenerSignature<M> = {
    [K in keyof M]: (...args: any) => Promise<any>;
};
declare type HookallOnCallback<M extends ListenerSignature<M>, K extends keyof M> = (value: Awaited<ReturnType<M[K]>>) => Promise<Awaited<ReturnType<M[K]>>>;
declare type HookallTriggerCallback<M extends ListenerSignature<M>, K extends keyof M> = (value: Parameters<M[K]>[0]) => Promise<Awaited<ReturnType<M[K]>>>;
declare type HookallCallbackWrapper<M extends ListenerSignature<M>, K extends keyof M> = {
    callback: HookallOnCallback<M, K>;
    command: HookallLifeCycle<(keyof M) & string>;
    repeat: number;
};
declare type HookallCallbackMap<M extends ListenerSignature<M>, K extends keyof M> = Map<K, HookallCallbackWrapper<M, K>[]>;
export interface IHookall<M extends ListenerSignature<M> = DefaultListener> {
    onBefore<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    onAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    onceBefore<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    onceAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: M[K]): this;
    offBefore<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: M[K]): this;
    offAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: M[K]): this;
    trigger<K extends keyof M>(command: K & string, ...args: Parameters<M[K]>): Promise<void | ReturnType<M[K]>>;
}
declare class Hookall<M extends ListenerSignature<M>> implements IHookall<M> {
    static readonly Global: {};
    private static readonly _Store;
    protected readonly beforeHooks: HookallCallbackMap<M, keyof M>;
    protected readonly afterHooks: HookallCallbackMap<M, keyof M>;
    /**
     * Create hook system. you can pass a target object or undefined.
     * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
     * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
     * @param target The object to work with locally. If not specified, will be work for global.
     */
    constructor(target: object);
    private _ensureCommand;
    private _createWrapper;
    private _on;
    /**
     * You register a preprocessing function, which is called before the callback function of the `trigger` method.
     * The value returned by this function is passed as a parameter to the `trigger` method's callback function.
     * If you register multiple preprocessing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.
     * @param command Command to work.
     * @param callback Preprocessing function to register.
     */
    onBefore<K extends keyof M>(command: K & string, callback: HookallOnCallback<M, K>): this;
    /**
     * Similar to the `onBefore` method, but it only runs once.
     * For more details, please refer to the `onBefore` method.
     * @param command Command to work.
     * @param callback Preprocessing function to register.
     */
    onceBefore<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: HookallOnCallback<M, K>): this;
    /**
     * You register a post-processing function which is called after the callback function of the `trigger` method finishes.
     * This function receives the value returned by the `trigger` method's callback function as a parameter.
     * If you register multiple post-processing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.
     * @param command Command to work.
     * @param callback Post-preprocessing function to register.
     */
    onAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: HookallOnCallback<M, K>): this;
    /**
     * Similar to the `onAfter` method, but it only runs once.
     * For more details, please refer to the `onAfter` method.
     * @param command Command to work.
     * @param callback Post-preprocessing function to register.
     */
    onceAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback: HookallOnCallback<M, K>): this;
    private _off;
    /**
     * You remove the preprocessing functions registered with `onBefore` or `onceBefore` methods.
     * If you don't specify a callback parameter, it removes all preprocessing functions registered for that command.
     * @param command Commands with preprocessing functions to be deleted.
     * @param callback Preprocessing function to be deleted.
     */
    offBefore<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: HookallOnCallback<M, K>): this;
    /**
     * You remove the post-preprocessing functions registered with `onAfter` or `onceAfter` methods.
     * If you don't specify a callback parameter, it removes all post-preprocessing functions registered for that command.
     * @param command Commands with post-preprocessing functions to be deleted.
     * @param callback post-Preprocessing function to be deleted.
     */
    offAfter<K extends keyof M>(command: HookallLifeCycle<K & string>, callback?: HookallOnCallback<M, K>): this;
    private _hookWith;
    /**
     * You execute the callback function provided as a parameter. This callback function receives the 'initialValue' parameter.
     *
     * If preprocessing functions are registered, they run first, and the value returned by the preprocessing functions becomes the 'initialValue' parameter.
     * After the callback function finishes, post-processing functions are called.
     * These post-processing functions receive the value returned by the callback function as a parameter and run sequentially.
     *
     * The final value returned becomes the result of the `trigger` method.
     * @param command Command to work.
     * @param initialValue Initial value to be passed to the callback function.
     * @param callback The callback function to be executed.
     */
    trigger<K extends keyof M>(command: K & string, initialValue: Awaited<ReturnType<M[K]>>, callback: HookallTriggerCallback<M, K>): Promise<Awaited<ReturnType<M[K]>>>;
}
/**
 * Create hook system. you can pass a target object or undefined.
 * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
 * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
 * @param target The object to work with locally. If not specified, will be work for global. Default is `Hookall.Global`.
 */
export declare function useHookall<M extends ListenerSignature<M> = DefaultListener>(target?: object): Hookall<M>;
export {};
