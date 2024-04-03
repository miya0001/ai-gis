/**
 * Knowledge Base を検索して、プロンプトを補うための参考情報を返す
 *
 * @module KnowledgeBase
 */

import { BedrockAgentRuntimeClient, RetrieveCommand, RetrieveCommandInput } from "@aws-sdk/client-bedrock-agent-runtime"

const numberOfResults = 10

export class KnowledgeBase {

  client: BedrockAgentRuntimeClient

  constructor(config: { apiVersion: string, region: string }) {
    this.client = new BedrockAgentRuntimeClient(config)
  }

  /**
   * Knowledge Base を検索して、プロンプトを補うための参考情報を返す
   *
   * @param query
   * @returns
   */
  async search(query: string) {
    const input = { // RetrieveReques
      knowledgeBaseId: process.env.knowledge_base_id, // required
      retrievalQuery: { // KnowledgeBaseQuery
        text: query, // required
      },
      retrievalConfiguration: { // KnowledgeBaseRetrievalConfiguration
        vectorSearchConfiguration: { // KnowledgeBaseVectorSearchConfiguration
          numberOfResults: numberOfResults, // required
        },
      },
    } as RetrieveCommandInput

    const command = new RetrieveCommand(input);
    const response = await this.client.send(command)

    return response
  }
}
