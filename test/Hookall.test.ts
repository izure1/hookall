import { useHookall } from '../src/Hookall'

interface Hook {
  'lifecycle1': (n: number) => Promise<number>
  'lifecycle2': (n: number) => Promise<number>
  'local-hook-once': (n: number) => Promise<number>
}

test('hook-lifecycle', async () => {
  const hook = useHookall<Hook>({})

  hook.onBefore('lifecycle1', async (n) => {
    return n*n
  }).onBefore('lifecycle1', async (n) => {
    return n+n
  })

  hook.onBefore('lifecycle2', async (n) => {
    return n*n
  }).onBefore('lifecycle2', async (n) => {
    return n+n
  }).onAfter('lifecycle2', async (n) => {
    return Math.log(n)
  })

  const r1 = await hook.trigger('lifecycle1', 2, async (v) => {
    return v
  })

  const r2 = await hook.trigger('lifecycle2', 2, async (v) => {
    return v
  })

  expect(r1).toBe(8)
  expect(r2).toBe(Math.log(8))
})

test('local-hook-once', async () => {
  const hook = useHookall<Hook>({})

  hook
    .onceBefore('local-hook-once', async (n) => {
      return n*n
    })
    .onBefore('local-hook-once', async (n) => {
      return n*n
    })
    .onceAfter('local-hook-once', async (n) => {
      return n+1
    })
    .onAfter('local-hook-once', async (n) => {
      return n+2
    })

  const res1 = await hook.trigger('local-hook-once', 2, async (n) => {
    return n
  })
  const res2 = await hook.trigger('local-hook-once', 2, async (n) => {
    return n
  })
  const res3 = await hook.trigger('local-hook-once', 3, async (n) => {
    return n
  })

  expect(res1).toBe(19)
  expect(res2).toBe(6)
  expect(res3).toBe(11)
})
