/**
 * マークダウンフォーマットのテキストを取得して、コードブロックの中のソースコードだけを返す
 * @param text マークダウンフォーマットのテキスト
 * @returns コードブロックの中のソースコード
 */
export const getCodeBlock = (text) => {
  if (text.indexOf('{') === -1) {
    return text
  } else {
    const code = text.match(/\{[\s\S]*\}/g)[0]
    return code
  }
}
