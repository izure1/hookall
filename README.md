# Hookall

[![](https://data.jsdelivr.com/v1/package/npm/hookall/badge)](https://www.jsdelivr.com/package/npm/hookall)
![Node.js workflow](https://github.com/izure1/hookall/actions/workflows/node.js.yml/badge.svg)

Enhance your program's strength and flexibility by seamlessly hooking into the operation.

```typescript
import { useHookall } from 'hookall'

const hook = useHookall(yourObject)

hook.onBefore('run', async (arr) => {
  arr.push(2)
  return arr
})

hook.onAfter('run', async (arr) => {
  arr.push(4)
  return arr
})

const initial = [1]
const arr = await hook.trigger('run', initial, (arr) => {
  arr.push(3)
  return arr
}) // console: [1, 2, 3, 4]
```

**Attention!**  
`Ver.2` has many differences compared to `Ver.1`, especially in the preprocessing and post-processing steps. Please refer to the documentation.

## Why use Hookall?

### Strict type definition with typescript

If you want to support strict type definitions with typescript, you can use the following syntax.

```typescript
import { writeFile } from 'fs/promises'
import { useHookall, IHookall } from 'hookall'

class FileBuilder {
  private _name: string

  constructor() {
    this._name = ''
  }

  setName(name: string): void {
    this._name = name
    return this
  }

  async make(): Promise<string> {
    const filePath = this._dir+this._name
    const hook = useHookall<Hook>(this)

    return await hook.trigger('make', filePath, async (filePath) => {
      return await writeFile(filePath)
    })
  }
}

type Hook = {
  make: (filePath: string) => Promise<string>
}

const builder = new FileBuilder()
const backupHook = useHookall<Hook>(builder)

hook.onBefore('make', async (filePath) => {
  return filePath.replace('.txt', '.json')
})
hook.onAfter('make', async (filePath) => {
  console.log('file created!')
  return filePath
})

const filePath = await builder.setName('my-file.txt').make()
console.log(filePath) // my-file.json
```

### Work asynchronously

`hookall` library supports asynchronous.

```typescript
hook.on('create', async (el) => {
  await doSomething(el)
  return el
})

hook.on('create', async (el) => {
  await doSomethingAnother(el)
  return el
})

console.log('create!')
await hook.trigger('create', element)
console.log('done!')
```

### Data hooking using a life cycle

You can hook into the process using the `onBefore` and `onAfter` methods.

```typescript
const hook = useHookall(someObject)

hook.onBefore('create', async (data) => {
  if (!data) {
    throw new Error('There is no initialization data.')
  }
  return data
})

hook.onAfter('create', async (data) => {
  // ...
})

const initialData = await getFromRemote() // get a null
const err = await hook.trigger('create', initialData, async (initialData) => {
  await doJob(initialData)
  return initialData
}) // Error! There is no initialization data.
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
  import { useHookall } from 'https://cdn.jsdelivr.net/npm/hookall@2.x.x/dist/esm/index.min.js'
</script>
```

## Methods

### `useHookall` (target: `object`|`undefined`)

Create hook system. you can pass a target `object` or `undefined`. If you pass a `object`, the hook system will be work for object locally. You're going to want this kind of usage in general.

```typescript
import { useHookall } from 'hookall'

const element = document.querySelector('your-selector')
const hook = useHookall(element)

hook.onBefore('create', async () => { ... })
```

If not specified, will be work for global. This is useful when you want to share your work with multiple files.

```typescript
import { useHookall } from 'hookall'

// file A.ts
const globalHook = useHookall()
globalHook.onBefore('from-B', async (now) => { ... })

// file B.ts
const globalHook = useHookall()
await globalHook.trigger('from-B', Date.now(), () => {
  // ...
})
```

### `onBefore` (command: `string`, callback: `Function`): `this`

You register a preprocessing function, which is called before the callback function of the `trigger` method.

The value returned by this function is passed as a parameter to the `trigger` method's callback function. If you register multiple preprocessing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.

### `onceBefore` (command: `string`, callback: `Function`): `this`

Similar to the `onBefore` method, but it only runs once.
For more details, please refer to the `onBefore` method.

### `onAfter` (command: `string`, callback: `Function`): `this`

You register a post-processing function which is called after the callback function of the `trigger` method finishes.

This function receives the value returned by the `trigger` method's callback function as a parameter. If you register multiple post-processing functions, they are executed in order, with each function receiving the value returned by the previous one as a parameter.

### `onceAfter` (command: `string`, callback: `Function`): `this`

Similar to the `onAfter` method, but it only runs once.
For more details, please refer to the `onAfter` method.

### `offBefore` (command: `string`, callback?: `Function`): `this`

You remove the preprocessing functions registered with `onBefore` or `onceBefore` methods.  
If you don't specify a callback parameter, it removes all preprocessing functions registered for that command.

### `offAfter` (command: `string`, callback?: `Function`): `this`

You remove the post-preprocessing functions registered with `onAfter` or `onceAfter` methods.  
If you don't specify a callback parameter, it removes all post-preprocessing functions registered for that command.

### `trigger` (command: `string`, arg: `any`): `Promise<any>`

You execute the callback function provided as a parameter. This callback function receives the `initialValue` parameter.

If preprocessing functions are registered, they run first, and the value returned by the preprocessing functions becomes the `initialValue` parameter.

After the callback function finishes, post-processing functions are called.
These post-processing functions receive the value returned by the callback function as a parameter and run sequentially.

The final value returned becomes the result of the `trigger` method.

## License

MIT License
