import { useHookall } from '../src/Hookall'

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

interface Hook {
  'a': (before: { value: number }) => Promise<void|number>
  'b': (before: { value: number }) => Promise<void>
  'c': (before: { value: number }) => Promise<void>
}

test('hook-lifecycle', async () => {
  const hook = useHookall<Hook>({})

  hook
  .on('before:a', async (data) => {
    data.value = 1
    return data.value
  })
  .on('a', async (data) => {
    return data.value
  })

  const t = await hook.trigger('a', { value: 0 })
  expect(t).toBe(1)
})

test('local-hook-on', async () => {
  const hook = useHookall<Hook>({})
  hook
    .on('a', async (before) => {
      await delay(1000)
      console.log('process', before)
      await hook.trigger('b', { value: Date.now() })
    })
    .on('b', async (before) => {
      await delay(1000)
      console.log('process', before)
      await hook.trigger('c', { value: Date.now() })
    })
    .on('c', async (before) => {
      await delay(1000)
      console.log('process', before)
    })
  
  await hook.trigger('a', { value: Date.now() })
  console.log('done', Date.now())
})

test('local-hook-stop', async () => {
  const hook = useHookall<Hook>({})

  hook
    .on('a', async () => {
      await delay(1000)
      console.log(1)
    })
    .on('a', async () => {
      await delay(1000)
      console.log(2)
      return 2
    })
    .on('a', async () => {
      await delay(1000)
      console.log(3)
    })

  const result = await hook.trigger('a', { value: 0 })
  expect(result).toBe(2)
})

test('local-hook-once', async () => {
  const hook = useHookall<Hook>({})

  hook
    .once('a', async () => {
      console.log('once', 1)
      return 1
    })
    .on('a', async () => {
      console.log('on', 2)
      return 2
    })

  const a = await hook.trigger('a', { value: 0 })
  const b = await hook.trigger('a', { value: 0 })
  const c = await hook.trigger('a', { value: 0 })

  expect(a).toBe(1)
  expect(b).toBe(2)
  expect(c).toBe(2)
})
