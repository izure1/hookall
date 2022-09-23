# Hookall

[![](https://data.jsdelivr.com/v1/package/npm/hookall/badge)](https://www.jsdelivr.com/package/npm/hookall)

The hook system like a event emitter. but no require inherit.

```typescript
import { useHookall } from 'hookall'

const hook = useHookall(yourObject)

hook.on('run', async (a, b, c) => {
  console.log(a, b, c)
})

await hook.trigger('run', 1, 2, 3) // console: 1, 2, 3
```

## Why use Hookall?

The event emitter is powerful function that can be used to emit events. but sometimes you cannot inherit that.

```typescript
class MyWebComponent extends HTMLElement {
  // You can't inherit event emitter if need to inherit another class.
}
```

The hookall system will be useful for like this situation.

```typescript
import { useHookall } from 'hookall'

class MyWebComponent extends HTMLElement {
  constructor() {
    super()
    this.hook = useHookall(this)
    this.hook.on('create', async () => {
      ...
    })
  }

  connectedCallback(): void {
    await this.hook.trigger('create')
    ...
  }
}
```

## How to use

### Node.js (cjs)

```bash
npm i hookall
```

```typescript
import { useHookall } from 'hookall'
```

### Browser (esm)

```html
<script type="module">
  import { useHookall } from 'https://cdn.jsdelivr.net/npm/hookall@1.x.x/dist/esm/index.js'
</script>
```

## Methods

### `useHookall` (target: `object`|`undefined`)

Create hook system. you can pass a target object or undefined. If you pass a object, the hook system will be work for object locally. If not specified, will be work for global.

```typescript
import { useHookall } from 'hookall'

// file A
const globalHook = useHookall()

globalHook.on('from-B', async (now) => { ... })

// file B
const globalHook = useHookall()

globalHook.trigger('from-B', Date.now())
```

### `on` (command: `string`, callback: `Function`): `this`

Register the callback function. Registered functions can then be called past the same command with the `trigger` method. The parameters of the callback function are those passed when calling the `trigger` method.

### `off` (command: `string,` callback?: `Function`): `this`

Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.

### `trigger` (command: `string`, ...args: `any`): `Promise<void>`

Invokes all callback functions registered with the on method. The callback function is called in the registered order and can operate asynchronously. Therefore, the `await` keyword allows you to wait until all registered callback functions are called.

## License

MIT License.