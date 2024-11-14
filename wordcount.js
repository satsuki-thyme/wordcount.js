async function wordcount(srcInput, periodicSymbolInput, parenthesisInput) {
  let periodicSymbol = periodicSymbolInput || ["。", "！　", "？　", "‼　", "⁉　", "❕　", "❗　", "❔　", "❓　", "!　", "\\?　"]
  let parenthesisArray = parenthesisInput || [["「", "」"], ["『", "』"], ["（", "）"]]
  let noRubyText = await removeRuby(srcInput)
  let singleLine = noRubyText.replace(/[\r\n　 \t]/g, ``)
  let totalCount = singleLine.length
  let kanjiExist = /\p{scx=Han}/u.test(singleLine) ? true : false
  let kanjiCount = kanjiExist === true ? singleLine.match(/\p{scx=Han}/ug).join(``).length : 0
  return {"total": totalCount, "kanji": kanjiCount, "parenthesis": await countParenthesis(), "letterLength": await letterLength(noRubyText)}
  async function removeRuby(srcInput) {
    return srcInput
    .replace(/[|｜](.+?)《(.+?)》/g, `$1`)
    .replace(new RegExp(`[｜|](.+?)《(.+?)》`, `g`), `$1`)
    .replace(/[｜|](.+?)\((\p{scx=Hira}|\p{scx=Kana})\)/ug, `$1`)
    .replace(/(\p{scx=Han}+)（(\p{scx=Hira}|\p{scx=Kana})+）/ug, `$1`)
    .replace(/[|｜]([《\(（])(.+?)([》\)）])/g, `$1$2$3`)
    .replace(/#(.+?)__(.+?)__#/g, `$1`)
  }
  async function countParenthesis() {
    let len = 0
    for (let val of parenthesisArray) {
      let re = new RegExp(`${val[0]}.*?${val[1]}`, `g`)
      len += (singleLine.match(re) || [``]).join(``).length
    }
    return len
  }
  async function letterLength(srcInput) {
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
