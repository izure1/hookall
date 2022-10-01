type DefaultListener = {
  [k: string]: (...args: any) => Promise<any>
}

type ListenerSignature<M> = {
  [K in keyof M]: (...args: any) => Promise<any>
}

type HookallCallback<M extends ListenerSignature<M>, K extends keyof M> = (...args: Parameters<M[K]>) => Promise<void|ReturnType<M[K]>>

type HookallCallbackMap<M extends ListenerSignature<M>> = Map<string|number|symbol, HookallCallback<M, keyof M>[]>


class HookallStore<M extends ListenerSignature<M>> extends WeakMap<object, HookallCallbackMap<M>> {
  ensure(key: object): HookallCallbackMap<M> {
    if (!this.has(key)) {
      const command = new Map() as HookallCallbackMap<M>
      this.set(key, command)
    }
    return this.get(key)!
  }
}

class Hookall<M extends ListenerSignature<M>> {
  static readonly Global = {}
  private static readonly _Store = new HookallStore()

  protected readonly _command: HookallCallbackMap<M>

  /**
   * Create hook system. you can pass a target object or undefined.
   * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
   * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
   * @param target The object to work with locally. If not specified, will be work for global.
   */
  constructor(target: object) {
    this._command = Hookall._Store.ensure(target) as any
  }

  private _ensureCommand<K extends keyof M>(command: K): HookallCallback<M, K>[] {
    if (!this._command.has(command)) {
      this._command.set(command, [])
    }
    return this._command.get(command)!
  }

  /**
   * Register the callback function. Registered functions can then be called past the same command with the `trigger` method.
   * The parameters of the callback function are those passed when calling the `trigger` method.
   * If callback function returns non `undefined`, subsequent callback functions are no longer called.
   * @param command The unique key for call `off` or `trigger`.
   * @param callback The callback function.
   */
  on<K extends keyof M>(command: K, callback: M[K]): this {
    const callbacks = this._ensureCommand(command)
    callbacks.push(callback)
    return this
  }

  /**
   * Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.
   * @param command The unique key from `on`.
   * @param callback The callback function. If not specified, all callback functions will be removed.
   */
  off<K extends keyof M>(command: K, callback: M[K]|null = null): this {
    const callbacks = this._ensureCommand(command)
    if (callback !== null) {
      const i = callbacks.indexOf(callback)
      if (i !== -1) {
        callbacks.splice(i, 1)
      }
    }
    callbacks.length = 0
    return this
  }

  /**
   * Invokes all callback functions registered with the on method. The callback function is called in the registered order and can operate asynchronously.
   * Therefore, the `await` keyword allows you to wait until all registered callback functions are called.
   * If the callback function registered with the `on` method returns a non `undefined` value, it stops subsequent callback function calls and returns that value.
   * @param command The unique key from `on`.
   * @param args pass arguments to the callback function.
   */
  async trigger<K extends keyof M>(command: K, ...args: Parameters<M[K]>): Promise<void|ReturnType<M[K]>> {
    const callbacks = this._ensureCommand(command)
    let r: any
    for (const callback of callbacks) {
      r = await callback(...args)
      if (r !== undefined) {
        break
      }
    }
    return r
  }
}

/**
 * Create hook system. you can pass a target object or undefined.
 * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
 * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
 * @param target The object to work with locally. If not specified, will be work for global. Default is `Hookall.Global`.
 */
export function useHookall<M extends ListenerSignature<M> = DefaultListener>(target: object = Hookall.Global): Hookall<M> {
  return new Hookall<M>(target)
}
