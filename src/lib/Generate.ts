import { BedrockRuntime } from "@aws-sdk/client-bedrock-runtime"
import { KnowledgeBase } from './KnowledgeBase'
import { getYears } from "./today"

const filePrefixToRemove = 's3://geolonia-knowledgebase/'

const maxHistoryOfPromps = 5
const minimumScore = 0.8

const years = getYears()

const command = `

Human:# Instructions

You are an AI assistant responsible for generating data in GeoJSON format in response to questions, instructions, and reference information provided by users.

# Conditions

* You MUST limit your actions to the generation of GeoJSON.
* You MUST generate GeoJSON based on the content of the reference information.
* Do not include any text other than GeoJSON.
* In the 'properties' field, make sure to include the following keys:
  * Store the facility name under the key 'title'.
  * Store the address under the key 'address'.
  * Store a description of the facility in the description.
  * Description MUST be no more than 100 characters.
* You MUST limit the 'features' to a maximum of 10 entries.
* If there is no reference information, please return an empty GeoJSON.


Assistant:`

export class Generate {
  config: { apiVersion: string, region: string }
  bedrock: BedrockRuntime
  knowledgeBase: KnowledgeBase
  command: string

  prompts: string[] = [] // 文脈を保持するための配列

  constructor(config: { apiVersion: string, region: string }) {
    this.bedrock = new BedrockRuntime(config)
    this.knowledgeBase = new KnowledgeBase(config)
  }

  /**
   * AI に対して命令する
   */
  async init() {
    const answer = await this.send(command)
    this.command = command + answer
  }

  /**
   * 生成した回答を返す
   *
   * @param prompt
   * @returns
   */
  public async get(keywords: string, text: string) {
    const refs = await this.knowledgeBase.search(keywords)
    const references = []
    let reference = ''
    if (refs && refs.retrievalResults && refs.retrievalResults.length > 0) {
      for (let i = 0; i < refs.retrievalResults.length; i++) {
        const ref = refs.retrievalResults[i]
        if (ref.score < minimumScore) {
          continue
        }
        references.push(`${ref.content.text.trim()}\n\n## File\n${ref.location.s3Location.uri.replace(filePrefixToRemove, '')}`)
      }

      reference = `\n\n# 参考情報\n${references.join("\n\n---\n\n")}`
    }

    const prompt = "\n\nHuman:" + text + reference + "\n\nAssistant:"
    const answer = await this.send(this.command + this.prompts.join("") + prompt)
    this.prompts.push(prompt + answer)

    if (this.prompts.length > maxHistoryOfPromps) {
      this.prompts.shift() // コスト削減のため、過去のプロンプトは削除する
    }

    return answer
  }

  /**
   * AI に対して prompt を送信して回答を返す
   *
   * @param prompt
   * @returns
   */
  private async send(prompt: string) {
    const input = {
      // modelId: "anthropic.claude-v2", // かしこいけど高い、ちょっと遅い
      modelId: "anthropic.claude-instant-v1", // 速くて安い
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: prompt,
        max_tokens_to_sample: 10000,
        temperature: 0.4,
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
