import { useHookall } from '../src/Hookall'

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

interface Hook {
  'a': (before: number) => void
  'b': (before: number) => void
  'c': (before: number) => void
}

test('local-hook-on', async () => {
  const hook = useHookall<Hook>({})
  hook
    .on('a', async (before) => {
      await delay(1000)
      console.log('process', before)
      await hook.trigger('b', Date.now())
    })
    .on('b', async (before) => {
      await delay(1000)
      console.log('process', before)
      await hook.trigger('c', Date.now())
    })
    .on('c', async (before) => {
      await delay(1000)
      console.log('process', before)
    })
  
  await hook.trigger('a', Date.now())
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

  const result = await hook.trigger('a', 0)
  expect(result).toBe(2)
})
