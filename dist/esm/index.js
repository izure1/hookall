var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/Hookall.ts
var HookallStore = class extends WeakMap {
  ensure(obj, key) {
    if (!this.has(obj)) {
      const scope2 = {};
      this.set(obj, scope2);
    }
    const scope = this.get(obj);
    if (!Object.prototype.hasOwnProperty.call(scope, key)) {
      scope[key] = /* @__PURE__ */ new Map();
    }
    return scope[key];
  }
};
var _Hookall = class {
  beforeHooks;
  afterHooks;
  constructor(target) {
    this.beforeHooks = _Hookall._Store.ensure(target, "before");
    this.afterHooks = _Hookall._Store.ensure(target, "after");
  }
  _ensureCommand(hooks, command) {
    if (!hooks.has(command)) {
      hooks.set(command, []);
    }
    return hooks.get(command);
  }
  _createWrapper(command, callback, repeat) {
    return {
      callback,
      command,
      repeat
    };
  }
  _on(hooks, command, callback, repeat) {
    const wrappers = this._ensureCommand(hooks, command);
    const wrapper = this._createWrapper(command, callback, repeat);
    wrappers.unshift(wrapper);
  }
  onBefore(command, callback) {
    this._on(this.beforeHooks, command, callback, -1);
    return this;
  }
  onceBefore(command, callback) {
    this._on(this.beforeHooks, command, callback, 1);
    return this;
  }
  onAfter(command, callback) {
    this._on(this.afterHooks, command, callback, -1);
    return this;
  }
  onceAfter(command, callback) {
    this._on(this.afterHooks, command, callback, 1);
    return this;
  }
  _off(hooks, command, callback) {
    const wrappers = this._ensureCommand(hooks, command);
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
  offBefore(command, callback) {
    this._off(this.beforeHooks, command, callback);
    return this;
  }
  offAfter(command, callback) {
    this._off(this.afterHooks, command, callback);
    return this;
  }
  async _hookWith(hooks, command, value) {
    let wrappers = this._ensureCommand(hooks, command);
    let i = wrappers.length;
    while (i--) {
      const wrapper = wrappers[i];
      value = await wrapper.callback(value);
      wrapper.repeat -= 1;
      if (wrapper.repeat === 0) {
        this._off(hooks, command, wrapper.callback);
      }
    }
    return value;
  }
  async trigger(command, initialValue, callback) {
    let value;
    value = await this._hookWith(this.beforeHooks, command, initialValue);
    value = await callback(value);
    value = await this._hookWith(this.afterHooks, command, value);
    return value;
  }
};
var Hookall = _Hookall;
__publicField(Hookall, "Global", {});
__publicField(Hookall, "_Store", new HookallStore());
function useHookall(target = Hookall.Global) {
  return new Hookall(target);
}

// src/HookallSync.ts
var HookallStore2 = class extends WeakMap {
  ensure(obj, key) {
    if (!this.has(obj)) {
      const scope2 = {};
      this.set(obj, scope2);
    }
    const scope = this.get(obj);
    if (!Object.prototype.hasOwnProperty.call(scope, key)) {
      scope[key] = /* @__PURE__ */ new Map();
    }
    return scope[key];
  }
};
var _HookallSync = class {
  beforeHooks;
  afterHooks;
  constructor(target) {
    this.beforeHooks = _HookallSync._Store.ensure(target, "before");
    this.afterHooks = _HookallSync._Store.ensure(target, "after");
  }
  _ensureCommand(hooks, command) {
    if (!hooks.has(command)) {
      hooks.set(command, []);
    }
    return hooks.get(command);
  }
  _createWrapper(command, callback, repeat) {
    return {
      callback,
      command,
      repeat
    };
  }
  _on(hooks, command, callback, repeat) {
    const wrappers = this._ensureCommand(hooks, command);
    const wrapper = this._createWrapper(command, callback, repeat);
    wrappers.unshift(wrapper);
  }
  onBefore(command, callback) {
    this._on(this.beforeHooks, command, callback, -1);
    return this;
  }
  onceBefore(command, callback) {
    this._on(this.beforeHooks, command, callback, 1);
    return this;
  }
  onAfter(command, callback) {
    this._on(this.afterHooks, command, callback, -1);
    return this;
  }
  onceAfter(command, callback) {
    this._on(this.afterHooks, command, callback, 1);
    return this;
  }
  _off(hooks, command, callback) {
    const wrappers = this._ensureCommand(hooks, command);
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
  offBefore(command, callback) {
    this._off(this.beforeHooks, command, callback);
    return this;
  }
  offAfter(command, callback) {
    this._off(this.afterHooks, command, callback);
    return this;
  }
  _hookWith(hooks, command, value) {
    let wrappers = this._ensureCommand(hooks, command);
    let i = wrappers.length;
    while (i--) {
      const wrapper = wrappers[i];
      value = wrapper.callback(value);
      wrapper.repeat -= 1;
      if (wrapper.repeat === 0) {
        this._off(hooks, command, wrapper.callback);
      }
    }
    return value;
  }
  trigger(command, initialValue, callback) {
    let value;
    value = this._hookWith(this.beforeHooks, command, initialValue);
    value = callback(value);
    value = this._hookWith(this.afterHooks, command, value);
    return value;
  }
};
var HookallSync = _HookallSync;
__publicField(HookallSync, "Global", {});
__publicField(HookallSync, "_Store", new HookallStore2());
function useHookallSync(target = HookallSync.Global) {
  return new HookallSync(target);
}
export {
  useHookall,
  useHookallSync
};
