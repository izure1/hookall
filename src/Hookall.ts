type DefaultListener = {
  [k: string|number|symbol]: (...args: any) => Promise<any>
}

type ListenerSignature<M> = {
  [K in keyof M]: (...args: any) => Promise<any>
}

type HookallCallback<M extends ListenerSignature<M>, K extends keyof M> = (...args: Parameters<M[K]>) => Promise<void|ReturnType<M[K]>>

type HookallCallbackWrapper<M extends ListenerSignature<M>> = {
  callback: HookallCallback<M, keyof M>
  command: keyof M
  repeat: number
}

type HookallCallbackMap<M extends ListenerSignature<M>> = Map<string|number|symbol, HookallCallbackWrapper<M>[]>


class HookallStore<M extends ListenerSignature<M>> extends WeakMap<object, HookallCallbackMap<M>> {
  ensure(key: object): HookallCallbackMap<M> {
    if (!this.has(key)) {
      const command = new Map() as HookallCallbackMap<M>
      this.set(key, command)
    }
    return this.get(key)!
  }
}

export interface IHookall<M extends ListenerSignature<M> = DefaultListener> {
  on<K extends keyof M>(command: K, callback: M[K]): this
  off<K extends keyof M>(command: K, callback?: M[K]): this
  trigger<K extends keyof M>(command: K, ...args: Parameters<M[K]>): Promise<void|ReturnType<M[K]>>
}

class Hookall<M extends ListenerSignature<M>> implements IHookall<M> {
  static readonly Global = {}
  private static readonly __Store = new HookallStore()

  protected readonly __hookCommands: HookallCallbackMap<M>

  /**
   * Create hook system. you can pass a target object or undefined.
   * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
   * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
   * @param target The object to work with locally. If not specified, will be work for global.
   */
  constructor(target: object) {
    this.__hookCommands = Hookall.__Store.ensure(target) as any
  }

  private _ensureCommand<K extends keyof M>(command: K): HookallCallbackWrapper<M>[] {
    if (!this.__hookCommands.has(command)) {
      this.__hookCommands.set(command, [])
    }
    return this.__hookCommands.get(command)!
  }

  private _createWrapper(command: keyof M, callback: HookallCallback<M, keyof M>, repeat: number): HookallCallbackWrapper<M> {
    return {
      callback,
      command,
      repeat
    }
  }

  /**
   * Register the callback function. Registered functions can then be called past the same command with the `trigger` method.
   * The parameters of the callback function are those passed when calling the `trigger` method.
   * If callback function returns non `undefined`, subsequent callback functions are no longer called.
   * @param command The unique key for call `off` or `trigger`.
   * @param callback The callback function.
   */
  on<K extends keyof M>(command: K, callback: M[K]): this {
    const wrappers = this._ensureCommand(command)
    const wrapper = this._createWrapper(command, callback, -1)
    wrappers.push(wrapper)
    return this
  }

  once<K extends keyof M>(command: K, callback: M[K]): this {
    const wrappers = this._ensureCommand(command)
    const wrapper = this._createWrapper(command, callback, 1)
    wrappers.push(wrapper)
    return this
  }

  /**
   * Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.
   * @param command The unique key from `on`.
   * @param callback The callback function. If not specified, all callback functions will be removed.
   */
  off<K extends keyof M>(command: K, callback?: M[K]): this {
    const wrappers = this._ensureCommand(command)
    if (callback) {
      const i = wrappers.findIndex((wrapper) => wrapper.callback === callback)
      if (i !== -1) {
        wrappers.splice(i, 1)
      }
    }
    else {
      wrappers.length = 0
    }
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
    const wrappers = this._ensureCommand(command)
    let r: any
    for (const wrapper of wrappers) {
      r = await wrapper.callback(...args)
      wrapper.repeat -= 1
      if (wrapper.repeat === 0) {
        this.off(command, wrapper.callback as M[K])
      }
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
