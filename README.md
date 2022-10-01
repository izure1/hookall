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

### Multiple inheritance issue

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

    // No need to store hook instance like a this.hook = useHookall(this)
    const hook = useHookall(this)
    hook.on('create', async () => {
      ...
    })
  }

  connectedCallback(): void {
    // You can get same hooks everywhere when given a same object.
    const hook = useHookall(this)
    await hook.trigger('create')
  }
}
```

### Strict type definition with typescript

If you want to support strict type definitions with typescript, you can use the following syntax.

```typescript
type Hook = {
  'create':   (element: HTMLElement) => Promise<void>
  'destroy':  (timestamp: number) => Promise<void>
}

const el = document.querySelector('your-selector')
const hook = useHookall<Hook>(el)

hook.on('create', (element) => {
  console.log('element created!')
})
```

### Work with asynchronously

`hookall` library supports asynchronous.

```typescript
hook.on('create', async (el) => {
  await doSomething(el)
})

hook.on('create', async (el) => {
  await doSomethingAnother(el)
})

console.log('create!')

await hook.trigger('create', element)

console.log('done!')
```

### Stop event propagation

If you want, stop the event propagation. Just return `non-undefined` value.

```typescript
const hook = useHookall(someObject)

hook.on('test', async (num) => {
  if (num > 10) {
    return new Error('The parameter received is a number greater than 10.')
  }
})

hook.on('test', async () => {
  console.log('This message is not showing up in the console.')
})

const err = await hook.trigger('a', 11)
if (err) {
  throw err
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

Create hook system. you can pass a target object or undefined. If you pass a object, the hook system will be work for object locally. You're going to want this kind of usage in general.

```typescript
import { useHookall } from 'hookall'

const element = document.querySelector('your-selector')
const hook = useHookall(element)

hook.on('create', () => { ... })
```

If not specified, will be work for global. This is useful when you want to share your work with multiple files.

```typescript
import { useHookall } from 'hookall'

// file A.ts
const globalHook = useHookall()

globalHook.on('from-B', async (now) => { ... })

// file B.ts
const globalHook = useHookall()

globalHook.trigger('from-B', Date.now())
```

### `on` (command: `string`|`number`|`symbol`, callback: `Function`): `this`

Register the callback function. Registered functions can then be called past the same command with the `trigger` method. The parameters of the callback function are those passed when calling the `trigger` method. If callback function returns `non-undefined`, subsequent callback functions are no longer called.

### `off` (command: `string`|`number`|`symbol`, callback?: `Function`): `this`

Remove the callback function registered with the on method. If the callback function parameter is not exceeded, remove all callback functions registered with that command.

### `trigger` (command: `string`|`number`|`symbol`, ...args: `any`): `Promise<any>`

Invokes all callback functions registered with the on method. The callback function is called in the registered order and can operate asynchronously. Therefore, the `await` keyword allows you to wait until all registered callback functions are called. If the callback function registered with the `on` method returns a `non-undefined` value, it stops subsequent callback function calls and returns that value.

```typescript
const yourCharacter = someGameObject
const hook = useHookall(yourCharacter)

class Chair {
  constructor() {
    hook.on('character-sit', () => {
      if (yourCharacter.nearBy(this)) {
        return { ok: true, target: this }
      }
    })
  }
}

class ChairA extends Chair { ... }
class ChairB extends Chair { ... }
```

## License

MIT License
