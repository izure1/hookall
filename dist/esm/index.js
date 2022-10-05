var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/Hookall.ts
var HookallStore = class extends WeakMap {
  ensure(key) {
    if (!this.has(key)) {
      const command = /* @__PURE__ */ new Map();
      this.set(key, command);
    }
    return this.get(key);
  }
};
var _Hookall = class {
  __hookCommands;
  constructor(target) {
    this.__hookCommands = _Hookall.__Store.ensure(target);
  }
  _ensureCommand(command) {
    if (!this.__hookCommands.has(command)) {
      this.__hookCommands.set(command, []);
    }
    return this.__hookCommands.get(command);
  }
  on(command, callback) {
    const callbacks = this._ensureCommand(command);
    callbacks.push(callback);
    return this;
  }
  off(command, callback = null) {
    const callbacks = this._ensureCommand(command);
    if (callback !== null) {
      const i = callbacks.indexOf(callback);
      if (i !== -1) {
        callbacks.splice(i, 1);
      }
    }
    callbacks.length = 0;
    return this;
  }
  async trigger(command, ...args) {
    const callbacks = this._ensureCommand(command);
    let r;
    for (const callback of callbacks) {
      r = await callback(...args);
      if (r !== void 0) {
        break;
      }
    }
    return r;
  }
};
var Hookall = _Hookall;
__publicField(Hookall, "Global", {});
__publicField(Hookall, "__Store", new HookallStore());
function useHookall(target = Hookall.Global) {
  return new Hookall(target);
}
export {
  useHookall
};
