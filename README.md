# AWS の Bedrock を使ったチャットシステム

このプロジェクトは AWS の Bedrock を使用した AI チャットシステムです。
エンジニアが手っ取り早く試せるようにターミナル上で動作するようになっています。

![](https://www.evernote.com/shard/s21/sh/e2066981-5611-401b-8962-3c0e3285ad11/oBELwrNxxFDMktloSdRz_ODFqccEXguU9lwFqfh-ubdQoN2BV2hUGG1eCQ/deep/0/image.png)

## 特徴

* Bedrock の Knowledge Base を RAG として使用しています。
* 会話の履歴を保存しています。（最大10件）
* モデルには Claude Instant を使っています。

## 仕組み

* ユーザーが入力してきたテキストから、Claude Instant で検索キーワードを生成
* 生成されたキーワードで Knowledge Base 検索
* 検索結果のテキストをメインのプロンプトに参考情報として渡して、Claude Instant に回答を生成させる。

## 使い方

以下の値を含む環境変数を設定してください。

```
export AWS_ACCESS_KEY_ID=<AWS ACCESS KEY ID>
export AWS_SECRET_ACCESS_KEY=<AWS SECRET ACCESS KEY>
export knowledge_base_id=<Knowledge Base ID>
```

あとは以下のような感じ

```
$ git clone ...
$ cd bedrock-chat
$ npm install
$ npm start
```

## その他

### IAM ポリシー

```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "BedrockConsole",
			"Effect": "Allow",
			"Action": [
				"bedrock:InvokeModel",
				"bedrock:InvokeModelWithResponseStream",
				"bedrock:Retrieve",
				"bedrock:RetrieveAndGenerate"
			],
			"Resource": "*"
		}
	]
}
```
