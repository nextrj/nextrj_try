// See https://docs.deno.com/runtime/manual/basics/testing/mocking#stubbing
import { assertEquals, assertSpyCall, assertSpyCalls, assertThrows, returnsNext, stub } from './deps.ts'

function randomInt(lowerBound: number, upperBound: number): number {
  console.log(`lowerBound=${lowerBound}, upperBound=${upperBound}`)
  return lowerBound + Math.floor(Math.random() * (upperBound - lowerBound))
}

function randomMultiple(value: number): number {
  return value * _internals.randomInt(-10, 10)
}

const _internals = { randomInt }

Deno.test('test stub', () => {
  const randomIntStub = stub(_internals, 'randomInt', returnsNext([-3, 3, new Error('NextRJ')]))

  try {
    assertEquals(randomMultiple(5), -15)
    assertEquals(randomMultiple(5), 15)
    assertThrows(() => randomMultiple(5), Error, 'NextRJ')
  } finally {
    // unwraps the randomInt method on the _internals object
    randomIntStub.restore()
  }

  // asserts that randomIntStub was called at least once and details about the first call.
  assertSpyCall(randomIntStub, 0, {
    args: [-10, 10],
    returned: -3,
  })
  // asserts that randomIntStub was called at least twice and details about the second call.
  assertSpyCall(randomIntStub, 1, {
    args: [-10, 10],
    returned: 3,
  })

  // asserts that randomIntStub was only called twice.
  assertSpyCalls(randomIntStub, 3)
})
