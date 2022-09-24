import { useHookall } from '../src/Hookall'

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

interface Hook {
  'test': (a: number, b: number, c: number) => void
}

test('local-hook-on', async () => {
  const obj = {}
  const hook = useHookall<Hook>(obj)

  hook.on('test', async (a, b, c) => {
    delay(1000)
    console.log(1000)
    delay(1000)
    console.log('done', a, b, c)
  })

  await hook.trigger('test', 1, 2, 3)
})

test('local-hook-off', async () => {
  const obj = {}
  const hook = useHookall(obj)

  hook.on('test', async (a, b, c) => {
    delay(1000)
    console.log(1000)
    delay(1000)
    console.log('done', a, b, c)
  })

  await hook.trigger('test', 1, 2, 3)

  hook.off('test')

  await hook.trigger('test', 4, 5, 6)
})
