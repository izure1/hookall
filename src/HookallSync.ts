type HookallLifeCycle<K extends string> = K

type DefaultListener = {
  [k: string]: (...args: any) => any
}

type ListenerSignature<M> = {
  [K in keyof M]: (...args: any) => any
}

type HookallOnCallback<
  M extends ListenerSignature<M>,
  K extends keyof M
> = (value: ReturnType<M[K]>) => ReturnType<M[K]>

type HookallTriggerCallback<
  M extends ListenerSignature<M>,
  K extends keyof M
> = (value: Parameters<M[K]>[0]) => ReturnType<M[K]>

type HookallCallbackWrapper<
  M extends ListenerSignature<M>,
  K extends keyof M
> = {
  callback: HookallOnCallback<M, K>
  command: HookallLifeCycle<(keyof M)&string>
  repeat: number
}

type HookallCallbackMap<
  M extends ListenerSignature<M>,
  K extends keyof M
> = Map<K, HookallCallbackWrapper<M, K>[]>


class HookallStore<M extends ListenerSignature<M>, K extends keyof M> extends WeakMap<object, Record<string, HookallCallbackMap<M, K>>> {
  ensure(obj: object, key: string): HookallCallbackMap<M, K> {
    if (!this.has(obj)) {
      const scope: Record<string, HookallCallbackMap<M, K>> = {}
      this.set(obj, scope)
    }
    const scope = this.get(obj)!
    if (!Object.prototype.hasOwnProperty.call(scope, key)) {
      scope[key] = new Map()
    } 
    return scope[key]
  }
}

export interface IHookallSync<M extends ListenerSignature<M> = DefaultListener> {
  onBefore<K extends keyof M>(command: HookallLifeCycle<K&string>, callback: HookallOnCallback<M, K>): this
  onAfter<K extends keyof M>(command: HookallLifeCycle<K&string>, callback: HookallOnCallback<M, K>): this
  onceBefore<K extends keyof M>(command: HookallLifeCycle<K&string>, callback: HookallOnCallback<M, K>): this
  onceAfter<K extends keyof M>(command: HookallLifeCycle<K&string>, callback: HookallOnCallback<M, K>): this
  offBefore<K extends keyof M>(command: HookallLifeCycle<K&string>, callback?: HookallOnCallback<M, K>): this
  offAfter<K extends keyof M>(command: HookallLifeCycle<K&string>, callback?: HookallOnCallback<M, K>): this
  trigger<K extends keyof M>(command: K&string, initialValue: ReturnType<M[K]>, callback: HookallTriggerCallback<M, K>): ReturnType<M[K]>
}

class HookallSync<M extends ListenerSignature<M>> implements IHookallSync<M> {
  static readonly Global = {}
  private static readonly _Store = new HookallStore()

  protected readonly beforeHooks: HookallCallbackMap<M, keyof M>
  protected readonly afterHooks: HookallCallbackMap<M, keyof M>

  /**
   * Create hook system. you can pass a target object or undefined.
   * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
   * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
   * @param target The object to work with locally. If not specified, will be work for global.
   */
  constructor(target: object) {
    this.beforeHooks = HookallSync._Store.ensure(target, 'before') as any
    this.afterHooks = HookallSync._Store.ensure(target, 'after') as any
  }

  private _ensureCommand<K extends keyof M>(
    hooks: HookallCallbackMap<M, K>,
    command: HookallLifeCycle<K&string>
  ): HookallCallbackWrapper<M, K>[] {
    if (!hooks.has(command)) {
      hooks.set(command, [])
    }
    return hooks.get(command)!
  }

  private _createWrapper<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback: HookallOnCallback<M, K>,
    repeat: number
  ): HookallCallbackWrapper<M, K> {
    return {
      callback,
      command,
      repeat
    }
  }

  private _on<K extends keyof M>(
    hooks: HookallCallbackMap<M, K>,
    command: K&string,
    callback: HookallOnCallback<M, K>,
    repeat: number
  ): void {
    const wrappers = this._ensureCommand(hooks, command)
    const wrapper = this._createWrapper(command, callback, repeat)
    wrappers.unshift(wrapper)
  }

  /**
   * You register a preprocessing function, which is called before the callback function of the `trigger` method.
   * The value returned by this function is passed as a parameter to the `trigger` method's callback function.
   * If you register multiple preprocessing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.
   * @param command Command to work.
   * @param callback Preprocessing function to register.
   */
  onBefore<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback: HookallOnCallback<M, K>
  ): this {
    this._on(this.beforeHooks, command, callback, -1)
    return this
  }

  /**
   * Similar to the `onBefore` method, but it only runs once.
   * For more details, please refer to the `onBefore` method.
   * @param command Command to work.
   * @param callback Preprocessing function to register.
   */
  onceBefore<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback: HookallOnCallback<M, K>
  ): this {
    this._on(this.beforeHooks, command, callback, 1)
    return this
  }
  
  /**
   * You register a post-processing function which is called after the callback function of the `trigger` method finishes.
   * This function receives the value returned by the `trigger` method's callback function as a parameter.
   * If you register multiple post-processing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.
   * @param command Command to work.
   * @param callback Post-preprocessing function to register.
   */
  onAfter<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback: HookallOnCallback<M, K>
  ): this {
    this._on(this.afterHooks, command, callback, -1)
    return this
  }

  /**
   * Similar to the `onAfter` method, but it only runs once.
   * For more details, please refer to the `onAfter` method.
   * @param command Command to work.
   * @param callback Post-preprocessing function to register.
   */
  onceAfter<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback: HookallOnCallback<M, K>
  ): this {
    this._on(this.afterHooks, command, callback, 1)
    return this
  }

  private _off<K extends keyof M>(
    hooks: HookallCallbackMap<M, K>,
    command: HookallLifeCycle<K&string>,
    callback?: HookallOnCallback<M, K>
  ): this {
    const wrappers = this._ensureCommand(hooks, command)
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
   * You remove the preprocessing functions registered with `onBefore` or `onceBefore` methods.
   * If you don't specify a callback parameter, it removes all preprocessing functions registered for that command.
   * @param command Commands with preprocessing functions to be deleted.
   * @param callback Preprocessing function to be deleted.
   */
  offBefore<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback?: HookallOnCallback<M, K>
  ): this {
    this._off(this.beforeHooks, command, callback)
    return this
  }

  /**
   * You remove the post-preprocessing functions registered with `onAfter` or `onceAfter` methods.
   * If you don't specify a callback parameter, it removes all post-preprocessing functions registered for that command.
   * @param command Commands with post-preprocessing functions to be deleted.
   * @param callback post-Preprocessing function to be deleted.
   */
  offAfter<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    callback?: HookallOnCallback<M, K>
  ): this {
    this._off(this.afterHooks, command, callback)
    return this
  }

  private _hookWith<K extends keyof M>(
    hooks: HookallCallbackMap<M, K>,
    command: HookallLifeCycle<K&string>,
    value: ReturnType<M[K]>
  ): ReturnType<M[K]> {
    let wrappers = this._ensureCommand(hooks, command)
    let i = wrappers.length
    while (i--) {
      const wrapper = wrappers[i]
      value = wrapper.callback(value)
      wrapper.repeat -= 1
      if (wrapper.repeat === 0) {
        this._off(hooks, command, wrapper.callback)
      }
    }
    return value
  }

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
  trigger<K extends keyof M>(
    command: HookallLifeCycle<K&string>,
    initialValue: ReturnType<M[K]>,
    callback: HookallTriggerCallback<M, K>
  ): ReturnType<M[K]> {
    let value: any
    value = this._hookWith(this.beforeHooks, command, initialValue)
    value = callback(value)
    value = this._hookWith(this.afterHooks, command, value)
    return value
  }
}

/**
 * Create hook system. you can pass a target object or undefined.
 * If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.
 * If not specified, will be work for global. This is useful when you want to share your work with multiple files.
 * @param target The object to work with locally. If not specified, will be work for global. Default is `Hookall.Global`.
 */
export function useHookallSync<M extends ListenerSignature<M> = DefaultListener>(target: object = HookallSync.Global): HookallSync<M> {
  return new HookallSync<M>(target)
}
