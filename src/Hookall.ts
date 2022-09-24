type DefaultListener = {
  [k: string]: (...args: any) => void|Promise<void>
}

type ListenerSignature<M> = {
  [K in keyof M]: (...args: any) => void|Promise<void>
}

type HookallCallback<M extends ListenerSignature<M>, K extends keyof M> = (...args: Parameters<M[K]>) => void|Promise<void>

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

  constructor(target: object) {
    this._command = Hookall._Store.ensure(target)
  }

  private _ensureCommand<K extends keyof M>(command: K): HookallCallback<M, K>[] {
    if (!this._command.has(command)) {
      this._command.set(command, [])
    }
    return this._command.get(command)!
  }

  on<K extends keyof M>(command: K, callback: M[K]): this {
    const callbacks = this._ensureCommand(command)
    callbacks.push(callback)
    return this
  }

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

  async trigger<K extends keyof M>(command: K, ...args: Parameters<M[K]>): Promise<void> {
    const callbacks = this._ensureCommand(command)
    for (const callback of callbacks) {
      await callback(...args)
    }
  }
}

export function useHookall<L extends ListenerSignature<L> = DefaultListener>(target: object = Hookall.Global): Hookall<L> {
  return new Hookall<L>(target)
}
