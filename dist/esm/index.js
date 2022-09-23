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
  _command;
  constructor(target) {
    this._command = _Hookall._Store.ensure(target);
  }
  _ensureCommand(command) {
    if (!this._command.has(command)) {
      this._command.set(command, []);
    }
    return this._command.get(command);
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
    for (const callback of callbacks) {
      await callback(...args);
    }
  }
};
var Hookall = _Hookall;
__publicField(Hookall, "Global", {});
__publicField(Hookall, "_Store", new HookallStore());
function useHookall(target = Hookall.Global) {
  return new Hookall(target);
}
export {
  useHookall
};
