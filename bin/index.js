#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
const readline = __importStar(require("readline"));
const text = process.stdin.setEncoding('utf8');
const bedrockRuntime = new client_bedrock_runtime_1.BedrockRuntime({
    apiVersion: '2021-09-30',
    region: 'us-east-1'
});
let prompt = `

Human:

${text}


Assistant:`;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const main = async (prompt) => {
    const request = {
        "modelId": "anthropic.claude-v2:1",
        "contentType": "application/json",
        "accept": "*/*",
        "body": JSON.stringify({
            'prompt': prompt,
            "max_tokens_to_sample": 500,
            "temperature": 0.1,
            "top_k": 250,
            "top_p": 0.999,
            "stop_sequences": ["\n\nHuman:"],
            'anthropic_version': 'bedrock-2023-05-31'
        })
    };
    const response = await bedrockRuntime.invokeModel(request);
    return JSON.parse(Buffer.from(response.body).toString('utf-8'));
};
(async function () {
    const body = await main(prompt);
    prompt = prompt + body.completion.trim();
    process.stdout.write(`> `);
    rl.on('line', async (line) => {
        if (line.length) {
            rl.pause();
            console.log('');
            process.stdout.write('\x1b[5m\x1b[90m> \x1b[0m\x1b[0m');
            prompt = `${prompt}\n\nHuman:${line.trim()}\n\nAssistant:`;
            const body = await main(prompt);
            prompt = prompt + body.completion.trim();
            readline.cursorTo(process.stdout, 0);
            console.log('\x1b[90m%s\x1b[0m', `${body.completion.trim()}\n`);
            rl.resume();
        }
        process.stdout.write(`> `);
    });
}());
