// See https://docs.deno.com/runtime/manual/basics/testing/mocking#faking-time
import { assertSpyCalls, FakeTime, spy } from './deps.ts'

export function secondInterval(cb: () => void): number {
  return setInterval(cb, 1000)
}

Deno.test('test fake time', () => {
  // The Date, setTimeout, clearTimeout, setInterval and clearInterval globals
  // are replaced with versions that use the fake time until real time is restored
  const time = new FakeTime()

  try {
    const cb = spy()
    const intervalId = secondInterval(cb)
    assertSpyCalls(cb, 0)
    time.tick(500)
    assertSpyCalls(cb, 0)
    time.tick(500)
    assertSpyCalls(cb, 1)
    time.tick(3500)
    assertSpyCalls(cb, 4)

    clearInterval(intervalId)
    time.tick(1000)
    assertSpyCalls(cb, 4)
  } finally {
    time.restore()
  }
})
