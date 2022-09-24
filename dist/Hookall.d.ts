declare type DefaultListener = {
    [k: string]: (...args: any) => void | Promise<void>;
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
    constructor(target: object);
    private _ensureCommand;
    on<K extends keyof M>(command: K, callback: M[K]): this;
    off<K extends keyof M>(command: K, callback?: M[K] | null): this;
    trigger<K extends keyof M>(command: K, ...args: Parameters<M[K]>): Promise<void>;
}
export declare function useHookall<L extends ListenerSignature<L> = DefaultListener>(target?: object): Hookall<L>;
export {};
