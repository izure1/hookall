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
  _createWrapper(command, callback, repeat) {
    return {
      callback,
      command,
      repeat
    };
  }
  on(command, callback) {
    const wrappers = this._ensureCommand(command);
    const wrapper = this._createWrapper(command, callback, -1);
    wrappers.push(wrapper);
    return this;
  }
  once(command, callback) {
    const wrappers = this._ensureCommand(command);
    const wrapper = this._createWrapper(command, callback, 1);
    wrappers.push(wrapper);
    return this;
  }
  off(command, callback) {
    const wrappers = this._ensureCommand(command);
    if (callback) {
      const i = wrappers.findIndex((wrapper) => wrapper.callback === callback);
      if (i !== -1) {
        wrappers.splice(i, 1);
      }
    } else {
      wrappers.length = 0;
    }
    return this;
  }
  async trigger(command, ...args) {
    const wrappers = this._ensureCommand(command);
    let r;
    for (const wrapper of wrappers) {
      r = await wrapper.callback(...args);
      wrapper.repeat -= 1;
      if (wrapper.repeat === 0) {
        this.off(command, wrapper.callback);
      }
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
