import { getCodeBlock } from "../src/lib/getCodeBlock";

const text = `Hello world

{
  "hello": "world"
}`

test('the AI should answer something', async () => {
  const res = getCodeBlock(text)
  const json = JSON.parse(res)

  expect('world' === json.hello).toStrictEqual(true)
});
