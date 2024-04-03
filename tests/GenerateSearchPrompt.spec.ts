import { GenerateSearchPrompt } from "../src/lib/GenerateSearchPrompt";

const config = {
  apiVersion: '2021-09-30',
  region: 'us-east-1'
}

const prompt = new GenerateSearchPrompt(config)

test('the AI should answer something', async () => {
  await prompt.init()
  const answer1 = await prompt.get("国土地理院の予算を教えてください。")
  const answer2 = await prompt.get("他にはありますか？")

  console.log(answer1)
  console.log(answer2)

  // @ts-ignore
  expect(typeof answer1 === 'string' && typeof answer2 === 'string').toStrictEqual(true)
});
