import { useHookall, IHookall, useHookallSync, IHookallSync } from '../'

interface Hook {
  'lifecycle1': (n: number) => Promise<number>
  'lifecycle2': (n: number) => Promise<number>
  'local-hook-once': (n: number) => Promise<number>
}

interface HookSync {
  'lifecycle1': (n: number) => number
  'lifecycle2': (n: number) => number
  'local-hook-once': (n: number) => number
}

test('hook-lifecycle', async () => {
  const hook: IHookall<Hook> = useHookall<Hook>({})
  const hookSync: IHookallSync<HookSync> = useHookallSync<HookSync>({})

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

  hookSync.onBefore('lifecycle1', (n) => {
    return n*n
  }).onBefore('lifecycle1', (n) => {
    return n+n
  })

  hookSync.onBefore('lifecycle2', (n) => {
    return n*n
  }).onBefore('lifecycle2', (n) => {
    return n+n
  }).onAfter('lifecycle2', (n) => {
    return Math.log(n)
  })

  const r1 = await hook.trigger('lifecycle1', 2, async (v) => {
    return v
  })

  const r2 = await hook.trigger('lifecycle2', 2, async (v) => {
    return v
  })

  const r3 = hookSync.trigger('lifecycle1', 2, (v) => {
    return v
  })

  const r4 = hookSync.trigger('lifecycle2', 2, (v) => {
    return v
  })

  expect(r1).toBe(8)
  expect(r2).toBe(Math.log(8))

  expect(r3).toBe(8)
  expect(r4).toBe(Math.log(8))
})

test('local-hook-once', async () => {
  const hook = useHookall<Hook>({})
  const hookSync = useHookallSync<HookSync>({})

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

  hookSync
    .onceBefore('local-hook-once', (n) => {
      return n*n
    })
    .onBefore('local-hook-once', (n) => {
      return n*n
    })
    .onceAfter('local-hook-once', (n) => {
      return n+1
    })
    .onAfter('local-hook-once', (n) => {
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

  const res4 = hookSync.trigger('local-hook-once', 2, (n) => {
    return n
  })
  const res5 = hookSync.trigger('local-hook-once', 2, (n) => {
    return n
  })
  const res6 = hookSync.trigger('local-hook-once', 3, (n) => {
    return n
  })

  expect(res1).toBe(19)
  expect(res2).toBe(6)
  expect(res3).toBe(11)

  expect(res4).toBe(19)
  expect(res5).toBe(6)
  expect(res6).toBe(11)
})
