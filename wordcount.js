async function wordCount(srcInput, parenthesisInput) {
  let kanaKanjiSet = `[々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]`
  let kanaSet = `[\u3040-\u309F\u30A0-\u30FF]`
  let parenthesisArray = (parenthesisInput === undefined || parenthesisInput === ``) ? {"「": "」", "『": "』", "（": "）"} : parenthesisInput
  let noRubyDocu = removeRuby(srcInput)
  let singleLine = noRubyDocu.replace(/[\r\n　 \t]/g, ``)
  let totalWordCount = singleLine.length
  let kanjiExistence = new RegExp(`${kanaKanjiSet}`).test(singleLine) ? true : false
  let kanjiCount = kanjiExistence === true ? singleLine.match(new RegExp(`${kanaKanjiSet}`, `g`)).join(``).length : 0
  return countParenthesis(singleLine, parenthesisArray)
  .then(rly => {
    return {"total": totalWordCount, "kanji": kanjiCount, "parenthesis": rly, "letterLength": letterLength(noRubyDocu)}
  })
  function removeRuby(srcInput) {
    return srcInput
    .replace(/[|｜](.+?)《(.+?)》/g, `$1`)
    .replace(new RegExp(`[｜|](.+?)《(.+?)》`, `g`), `$1`)
    .replace(new RegExp(`[｜|](.+?)\((${kanaSet}+)\)`, `g`), `$1`)
    .replace(new RegExp(`(${kanaKanjiSet}+)（${kanaSet}+）`, `g`), `$1`)
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
  function letterLength(srcInput, periodicSymbolInput) {
    let periodicSymbol = periodicSymbolInput !== undefined ? periodicSymbolInput : ["。", "！　", "？　", "‼　", "⁉　", "❕　", "❗　", "❔　", "❓　", "!　", "\\?　"]
    let rx = new RegExp(`(?<=^|\r|\n|${periodicSymbol.join(`|`)}).+(\r|\n|${periodicSymbol.join(`|`)})`, `g`)
    let work0 = srcInput.match(rx) || []
    let work1 = []
    if (work0.length > 0) {
      work1 = work0
      .map(rly => rly.replace(/[\r\n　 \t]/g, ``).length)
      return work1.reduce((container, elemnt) => {return container + elemnt}, 0) / work0.length
    }
    else {
      return 0
    }
  }
}
