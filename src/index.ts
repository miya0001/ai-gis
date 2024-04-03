#!/usr/bin/env node

import { GenerateSearchPrompt } from "./lib/GenerateSearchPrompt";
import { Generate } from "./lib/Generate";
import { WebSocket } from 'ws';
import { getCodeBlock } from "./lib/getCodeBlock"

const ws = new WebSocket('wss://api-ws.geolonia.com/dev', {
  headers: {
    Origin: 'https://geolonia.github.io'
  }
})

import * as chalk from "chalk";
import * as readline from 'readline'

const config = {
  apiVersion: '2021-09-30',
  region: 'us-east-1'
}

const search = new GenerateSearchPrompt(config)
search.init()

const generate = new Generate(config)
generate.init()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async function () {
  process.stdout.write(`> `)

  rl.on('line', async (line: string) => {
    if (line.length) {
      rl.pause()
      console.log('')
      process.stdout.write('\x1b[5m\x1b[90m> \x1b[0m\x1b[0m')

      const keywords = await search.get(line.trim())

      process.stdout.write(chalk.gray(`「${keywords}」を検索しています...`))

      const answer = await generate.get(keywords, line.trim())

      readline.clearLine(process.stdout, 0)
      readline.cursorTo(process.stdout, 0)

      try {
        ws.send(JSON.stringify({
          action: "broadcast",
          channel: "signage",
          message: {
            geojson: JSON.parse(getCodeBlock(answer))
          }
        }))
      } catch (error) {
        // なんだか AI 君にやたらと改行を入れまくられるので削除
        const lines = answer.trim().split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (i > 0 && lines[i-1].trim().match(/^- /) && lines[i+1] && lines[i+1].trim().match(/^- /) && lines[i].trim().length === 0){
            continue
          }
          if (i > 0 && lines[i-1].trim().match(/^[0-9]\. /) && lines[i+1] && lines[i+1].trim().match(/^[0-9]\. /) && lines[i].trim().length === 0){
            continue
          }

          console.log(chalk.gray(lines[i]))
        }
      }

      console.log('')

      rl.resume()
    }

    process.stdout.write(`> `)
  })
}())
