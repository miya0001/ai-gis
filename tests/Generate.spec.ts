import { Generate } from "../src/lib/Generate";

const config = {
  apiVersion: '2021-09-30',
  region: 'us-east-1'
}

const generate = new Generate()

// @ts-ignore
test('the AI should answer something', async () => {
  await generate.init()
  const answer = await generate.get("Hello!")

  // @ts-ignore
  expect(typeof answer === 'string').toStrictEqual(true)
}, 60000)
