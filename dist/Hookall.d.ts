declare type HookallCallback = (...args: any) => (void | Promise<void>);
declare type HookallTargetCommand = Map<string, HookallCallback[]>;
export declare class Hookall {
    static readonly Global: {};
    private static readonly _Store;
    protected readonly _command: HookallTargetCommand;
    constructor(target: object);
    private _ensureCommand;
    on(command: string, callback: HookallCallback): this;
    off(command: string, callback?: HookallCallback | null): this;
    trigger(command: string, ...args: any): Promise<void>;
}
export declare function useHookall(store?: object): Hookall;
export {};
