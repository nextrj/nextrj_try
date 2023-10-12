import { assertGreater } from './deps.ts'

Deno.test('test', () => {
  assertGreater(2, 1)
})
