async function wordcount(srcInput, periodicSymbolInput, parenthesisInput) {
  let kanjiSet = `[々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]`
  let kanaSet = `[\u3040-\u309F\u30A0-\u30FF]`
  let periodicSymbol = periodicSymbolInput || ["。", "！　", "？　", "‼　", "⁉　", "❕　", "❗　", "❔　", "❓　", "!　", "\\?　"]
  let parenthesisArray = parenthesisInput || {"「": "」", "『": "』", "（": "）"}
  let noRubyText = removeRuby(srcInput)
  let singleLine = noRubyText.replace(/[\r\n　 \t]/g, ``)
  let totalCount = singleLine.length
  let kanjiExist = new RegExp(`${kanjiSet}`).test(singleLine) ? true : false
  let kanjiCount = kanjiExist === true ? singleLine.match(new RegExp(`${kanjiSet}`, `g`)).join(``).length : 0
  return countParenthesis(singleLine, parenthesisArray)
  .then(rly => {
    return {"total": totalCount, "kanji": kanjiCount, "parenthesis": rly, "letterLength": letterLength(noRubyText)}
  })
  function removeRuby(srcInput) {
    return srcInput
    .replace(/[|｜](.+?)《(.+?)》/g, `$1`)
    .replace(new RegExp(`[｜|](.+?)《(.+?)》`, `g`), `$1`)
    .replace(new RegExp(`[｜|](.+?)\((${kanaSet}+)\)`, `g`), `$1`)
    .replace(new RegExp(`(${kanjiSet}+)（${kanaSet}+）`, `g`), `$1`)
    .replace(/[|｜]([《\(（])(.+?)([》\)）])/g, `$1$2$3`)
    .replace(/#(.+?)__(.+?)__#/g, `$1`)
  }
  async function countParenthesis(singleLine, parenthesisArray) {
    return new Promise(resolve => {
      let parenthesisCount = 0
      let i = 0
      let inParenthesis = false
      let parenthesisType = ``
      let singleLineArray = singleLine.split(``)
      fn()
      function fn() {
        for (let j = 0; j < Object.keys(parenthesisArray).length - 1; j++) {
          /*
            括弧と一致しない
          */
          // 括弧と一致しない、括弧内ではない
          if (
            singleLineArray[i] !== Object.keys(parenthesisArray)[j]
            &&
            inParenthesis === false
          ) {
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
          // 
          else if (
            singleLineArray[i] !== Object.keys(parenthesisArray)[j]
            &&
            inParenthesis === true
            &&
            singleLineArray[i] !== parenthesisType
          ) {
            parenthesisCount++
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
          // 括弧と一致しない、括弧内である、閉じ括弧と一致する
          else if (
            singleLineArray[i] !== Object.keys(parenthesisArray)[j]
            &&
            inParenthesis === true
            &&
            singleLineArray[i] === parenthesisType
          ) {
            parenthesisCount++
            inParenthesis = false
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
          /*
            括弧と一致する
          */
          // 括弧と一致する、括弧内ではない
          else if (
            singleLineArray[i] === Object.keys(parenthesisArray)[j]
            &&
            inParenthesis === false
          ) {
            parenthesisCount++
            inParenthesis = true
            parenthesisType = parenthesisArray[Object.keys(parenthesisArray)[j]]
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
          // 括弧と一致する、括弧内である
          else if (
            singleLineArray[i] === Object.keys(parenthesisArray)[j]
            &&
            inParenthesis === true
          ) {
            parenthesisCount++
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
          // フールプルーフ
          else {
            console.error(`フールプルーフが働きました`)
            if (i < singleLine.length - 1) {
              i++
              fn()
            }
            else {
              resolve(parenthesisCount)
            }
          }
        }
      }
    })
  }
  function letterLength(srcInput) {
    let rx = new RegExp(`(?<=^|\r|\n|${periodicSymbol.join(`|`)}).+(\r|\n|${periodicSymbol.join(`|`)})`, `g`)
    let w0 = srcInput.match(rx) || []
    let w1 = []
    if (w0.length > 0) {
      w1 = w0
      .map(rly => rly.replace(/[\r\n　 \t]/g, ``).length)
      return w1.reduce((container, elemnt) => {return container + elemnt}, 0) / w0.length
    }
    else {
      return 0
    }
  }
}
