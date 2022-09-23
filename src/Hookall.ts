type HookallCallback = (...args: any) => (void|Promise<void>)
type HookallTargetCommand = Map<string, HookallCallback[]>

class HookallStore extends WeakMap<object, HookallTargetCommand> {
  ensure(key: object): HookallTargetCommand {
    if (!this.has(key)) {
      const command = new Map() as HookallTargetCommand
      this.set(key, command)
    }
    return this.get(key)!
  }
}

class Hookall {
  static readonly Global = {}
  private static readonly _Store = new HookallStore()

  protected readonly _command: HookallTargetCommand

  constructor(target: object) {
    this._command = Hookall._Store.ensure(target)
  }

  private _ensureCommand(command: string): HookallCallback[] {
    if (!this._command.has(command)) {
      this._command.set(command, [])
    }
    return this._command.get(command)!
  }

  on(command: string, callback: HookallCallback): this {
    const callbacks = this._ensureCommand(command)
    callbacks.push(callback)
    return this
  }

  off(command: string, callback: HookallCallback|null = null): this {
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

  async trigger(command: string, ...args: any): Promise<void> {
    const callbacks = this._ensureCommand(command)
    for (const callback of callbacks) {
      await callback(...args)
    }
  }
}

export function useHookall(target: object = Hookall.Global): Hookall {
  return new Hookall(target)
}
