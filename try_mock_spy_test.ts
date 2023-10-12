// See https://docs.deno.com/runtime/manual/basics/testing/mocking#spying
import { assertEquals, assertSpyCall, assertSpyCalls, spy } from './deps.ts'

function multiply(a: number, b: number): number {
  // console.log(`a=${a}, b=${b}`)
  return a * b
}

//==== way 1 to spy multiply: directly
function square(
  multiplyFn: (a: number, b: number) => number,
  value: number,
): number {
  return multiplyFn(value, value)
}

Deno.test('spy way 1', () => {
  const multiplySpy = spy(multiply)

  assertEquals(square(multiplySpy, 5), 25)

  // asserts that multiplySpy was called at least once and details about the first call.
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  })

  // asserts that multiplySpy was only called once.
  assertSpyCalls(multiplySpy, 1)
})

//==== way 2 to spy multiply: wrap a method on an object instead
const _internals = { multiply }
function square1(value: number): number {
  return _internals.multiply(value, value)
}

Deno.test('spy way 2', () => {
  const multiplySpy = spy(_internals, 'multiply')

  try {
    assertEquals(square1(5), 25)
  } finally {
    // unwraps the multiply method on the _internals object
    multiplySpy.restore()
  }

  // asserts that multiplySpy was called at least once and details about the first call.
  assertSpyCall(multiplySpy, 0, {
    args: [5, 5],
    returned: 25,
  })

  // asserts that multiplySpy was only called once.
  assertSpyCalls(multiplySpy, 1)
})
