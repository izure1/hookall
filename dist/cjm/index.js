"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useHookall: () => useHookall
});
module.exports = __toCommonJS(src_exports);

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
