import { KnowledgeBase } from "../src/lib/KnowledgeBase";

const config = {
  apiVersion: '2021-09-30',
  region: 'us-east-1'
}

const knowledge = new KnowledgeBase(config)

test('the AI should answer something', async () => {
  const answer = await knowledge.search("Hello!")

  // @ts-ignore
  expect(answer.retrievalResults.length > 0).toStrictEqual(true)
});

test('get the last line', async () => {
  const answer = `hello
world`

  const last = answer.trim().replace(/.*\n/g, '')

  // @ts-ignore
  expect(last).toStrictEqual('world')
});

