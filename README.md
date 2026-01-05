# Hookall

[![JSDeliver](https://data.jsdelivr.com/v1/package/npm/hookall/badge)](https://www.jsdelivr.com/package/npm/hookall)
[![Node.js CI](https://github.com/izure1/hookall/actions/workflows/node.js.yml/badge.svg)](https://github.com/izure1/hookall/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Hookall** is a lightweight, flexible, and type-safe hooking system for Node.js and the browser. Enhance your application's extensibility by seamlessly injecting logic into any operation.

---

## 🚀 Quick Start

```typescript
import { useHookall } from 'hookall'

const hook = useHookall(yourObject)

// 1. Register hooks
hook.onBefore('run', async (val) => {
  return [...val, 2]
})

hook.onAfter('run', async (val) => {
  return [...val, 4]
})

// 2. Trigger operation
const result = await hook.trigger('run', [1], async (val) => {
  return [...val, 3]
})

console.log(result) // [1, 2, 3, 4]
```

## 📋 Table of Contents

- [Why Hookall?](#-why-hookall)
- [Installation](#-installation)
- [Methods](#-methods)
- [Usage Examples](#-usage-examples)
- [License](#-license)

---

## ✨ Why Hookall?

### 🛡️ Strict Type Safety
Full TypeScript support for commands, parameters, and return types. Gain full IDE autocompletion and compile-time checks.

### 🔄 Asynchronous Support
Native support for `async/await`. Hooks are executed sequentially, ensuring data integrity across asynchronous operations.

### 🧬 Lifecycle Management
Easily manage complex workflows using predefined `onBefore` and `onAfter` lifecycles. Perfect for middleware, plugins, or validation logic.

### 🌍 Global & Local Scopes
Use hooks locally for specific objects or globally to share logic across different modules and files.

---

## 📦 Installation

### Node.js (Standard)

```bash
npm install hookall
```

```typescript
import { useHookall, useHookallSync } from 'hookall'
```

### Browser (ESM)

```html
<script type="module">
  import { useHookall } from 'https://cdn.jsdelivr.net/npm/hookall@2/+esm'
</script>
```

---

## 🛠️ Methods

### `useHookall(target?: object)`
Creates an asynchronous hook system.
- **target**: Optional. If provided, the hook system is scoped to this object. If omitted, it operates in a **global scope**.

### `useHookallSync(target?: object)`
Creates a synchronous hook system. Use this if your operations do not require `async/await`.

### `onBefore(command, callback)` / `onceBefore(command, callback)`
Registers a preprocessing function called **before** the main `trigger` callback.
- The return value of one hook is passed as the `initialValue` to the next.
- `onceBefore` runs only once and is then automatically removed.

### `onAfter(command, callback)` / `onceAfter(command, callback)`
Registers a post-processing function called **after** the main `trigger` callback finishes.
- Receives the result of the `trigger` callback (or previous `onAfter` hook) as its first argument.
- `onceAfter` runs only once.

### `offBefore(command, callback?)` / `offAfter(command, callback?)`
Removes registered hooks.
- If `callback` is omitted, all hooks for the specified `command` are removed.

### `trigger(command, initialValue, callback, ...params)`
Executes the hook lifecycle:
1. All `onBefore` hooks (sequentially).
2. The main `callback`.
3. All `onAfter` hooks (sequentially).

Returns the final processed value.

---

## 💡 Usage Examples

### Strict Type Definitions

Define a hook interface to get the most out of TypeScript:

```typescript
import { useHookall } from 'hookall'

interface MyHooks {
  save: (content: string, filename: string) => Promise<string>
}

const obj = { name: 'MyProcessor' }
const hook = useHookall<MyHooks>(obj)

hook.onBefore('save', async (content, filename) => {
  console.log(`Preparing to save ${filename}...`)
  return content.trim()
})

const result = await hook.trigger('save', '  Hello World  ', async (content, filename) => {
  // Save logic here
  return content
}, 'memo.txt')

console.log(result) // "Hello World"
```

### Passing Additional Parameters

You can pass extra arguments to `trigger` which will be available in all lifecycle hooks:

```typescript
hook.onBefore('process', async (data, options) => {
  if (options.verbose) console.log('Processing...')
  return data
})

await hook.trigger('process', data, async (data, options) => {
  return transform(data, options)
}, { verbose: true })
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
