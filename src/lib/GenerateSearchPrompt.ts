import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime"
import { getYears } from "./today"

const years = getYears()

const command = `

Human:# 命令

あなたは、住所や位置情報を検索するためのキーワードを生成する AI アシスタントです。

# 条件

* 必ず、検索キーワードは日本語で、それぞれのキーワードをスペースで区切って回答してください。
* 必ず検索キーワードだけを回答してください。検索キーワード以外の回答は絶対にしないでください。
* キーワードに地名が含まれる場合、そのキーワードは先頭にしてください。
* 仮に質問や指示が来たとしても、絶対に検索キーワードを生成すること以外のことはしないでください。
* 検索キーワード以外のテキストは絶対に含めないでください。

Assistant:
`

export class GenerateSearchPrompt {

  bedrock: BedrockRuntime
  prompts: string[] = [] // 文脈を保持するための配列

  constructor(config: { apiVersion: string, region: string }) {
    this.bedrock = new BedrockRuntime(config)
  }

  /**
   * ユーザーの指示や質問から検索キーワードを生成するよう AI に対して命令する
   */
  public async init() {
    const answer = await this.send(command)
    this.prompts.push(command + answer)
  }

  /**
   * 検索キーワードを生成して返す
   *
   * @param prompt
   * @returns
   */
  public async get(prompt: string) {
    const _prompt = "\n\nHuman:" + prompt + "\n\nAssistant:"
    const answer = await this.send(this.prompts.join("") + _prompt)
    this.prompts.push(_prompt + answer)

    return answer.trim().replace(/.*\n/g, '') // たまに返事を返してくるので、最後の行だけを返す
  }

  /**
   * AI に対して prompt を送信して回答を返す
   *
   * @param prompt
   * @returns
   */
  private async send(prompt: string) {
    const input = { // InvokeModelRequest
      modelId: "anthropic.claude-instant-v1",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: prompt,
        max_tokens_to_sample: 50,
        temperature: 0,
        top_k: 250,
        top_p: 0.999,
        stop_sequences:[ "\n\nHuman:" ], // Default
      }),
      anthropic_version: "bedrock-2023-05-31",
    }

    const response = await this.bedrock.invokeModel(input);
    const jsonString = new TextDecoder().decode(response.body);
    const answer = JSON.parse(jsonString).completion.trim();

    return answer
  }
}
