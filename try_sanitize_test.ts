import { assertGreater } from './deps.ts'

// Resource sanitizer
// See https://docs.deno.com/runtime/manual/basics/testing/sanitizers#resource-sanitizer
Deno.test({
  name: 'leaky resource test',
  async fn() {
    await Deno.open('README.md')
  },
  // default true:
  //   error: Leaking resources:
  //     - A file (rid 3) was opened during the test, but not closed during the test. Close the file handle by calling `file.close()`.
  sanitizeResources: false,
})

// Op sanitizer
// See https://docs.deno.com/runtime/manual/basics/testing/sanitizers#op-sanitizer
Deno.test({
  name: 'leaky operation test',
  fn() {
    crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode('a'.repeat(100000000)),
    )
  },
  // default true:
  //   error: Leaking async ops:
  //     - 1 async operation to digest data was started in this test, but never completed. This is often caused by not awaiting the result of a `crypto.subtle.digest` call.
  sanitizeOps: false,
})

// Exit sanitizer
// See https://docs.deno.com/runtime/manual/basics/testing/sanitizers#exit-sanitizer
Deno.test({
  name: 'false success',
  fn() {
    Deno.exit(0)
  },
  // default true:
  //   error: AssertionError: Test case attempted to exit with exit code: 0
  //       Deno.exit(0)
  sanitizeExit: false,
})
// This test never runs, because the process exits during "false success" test
Deno.test({
  name: 'failing test',
  fn() {
    throw new Error('this test fails')
  },
})
