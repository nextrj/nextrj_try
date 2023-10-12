// See https://docs.deno.com/runtime/manual/basics/testing/snapshot_testing
import { assertSnapshot, serialize, stripAnsiCode } from './deps.ts'

Deno.test('isSnapshotMatch', async function (t): Promise<void> {
  const a = {
    example: 123,
    hello: 'world!',
  }
  await assertSnapshot(t, a)
})

// Serializes `actual` and removes ANSI escape codes.
function customSerializer(actual: string) {
  return serialize(stripAnsiCode(actual))
}
Deno.test('Custom Serializer', async function (t): Promise<void> {
  const output = '\x1b[34mHello World!\x1b[39m'
  console.log(output)
  await assertSnapshot(t, output, {
    name: 'Custom Name',
    serializer: customSerializer,
  })
})
