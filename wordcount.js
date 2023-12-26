async function wordcount(srcInput, periodicSymbolInput, parenthesisInput) {
  let kanjiSet = `[々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]`
  let kanaSet = `[\u3040-\u309F\u30A0-\u30FF]`
  let periodicSymbol = periodicSymbolInput || ["。", "！　", "？　", "‼　", "⁉　", "❕　", "❗　", "❔　", "❓　", "!　", "\\?　"]
  let parenthesisArray = parenthesisInput || [["「", "」"], ["『", "』"], ["（", "）"]]
  let noRubyText = removeRuby(srcInput)
  let singleLine = noRubyText.replace(/[\r\n　 \t]/g, ``)
  let totalCount = singleLine.length
  let kanjiExist = new RegExp(`${kanjiSet}`).test(singleLine) ? true : false
  let kanjiCount = kanjiExist === true ? singleLine.match(new RegExp(`${kanjiSet}`, `g`)).join(``).length : 0
  return {"total": totalCount, "kanji": kanjiCount, "parenthesis": countParenthesis(), "letterLength": letterLength(noRubyText)}
  function removeRuby(srcInput) {
    return srcInput
    .replace(/[|｜](.+?)《(.+?)》/g, `$1`)
    .replace(new RegExp(`[｜|](.+?)《(.+?)》`, `g`), `$1`)
    .replace(new RegExp(`[｜|](.+?)\((${kanaSet}+)\)`, `g`), `$1`)
    .replace(new RegExp(`(${kanjiSet}+)（${kanaSet}+）`, `g`), `$1`)
    .replace(/[|｜]([《\(（])(.+?)([》\)）])/g, `$1$2$3`)
    .replace(/#(.+?)__(.+?)__#/g, `$1`)
  }
  function countParenthesis() {
    let len = 0
    for (let val of parenthesisArray) {
      let re = new RegExp(`${val[0]}.*?${val[1]}`, `g`)
      len += (singleLine.match(re) || [``]).join(``).length
    }
    return len
  }
  function letterLength(srcInput) {
    let rx = new RegExp(`(?<=^|\r|\n|${periodicSymbol.join(`|`)}).+(\r|\n|${periodicSymbol.join(`|`)})`, `g`)
    let w0 = srcInput.match(rx) || []
    let w1 = []
    if (w0.length > 0) {
      w1 = w0
      .map(rly => rly.replace(/[\r\n　 \t]/g, ``).length)
      return w1.reduce((container, elemnt) => container + elemnt, 0) / w0.length
    }
    else {
      return 0
    }
  }
}
