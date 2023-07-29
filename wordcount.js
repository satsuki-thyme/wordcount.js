async function wordCount(srcInput, parenthesisInput) {
  let parenthesisArray = (parenthesisInput === undefined || parenthesisInput === ``) ? {"「": "」", "『": "』", "（": "）"} : parenthesisInput
  let singleLine = srcInput
  .replace(/[\r\n　 ]/g, ``)
  .replace(/[|｜](.+?)《(.+?)》/g, `$1`)
  .replace(/([々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]+)《(.+?)》/g, `$1`)
  .replace(/([々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]+)\(([\u3040-\u309F\u30A0-\u30FF]+?)\)/g, `$1`)
  .replace(/([々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]+)（([\u3040-\u309F\u30A0-\u30FF]+?)）/g, `$1`)
  .replace(/[|｜]([《\(（])(.+?)([》\)）])/g, `$1$2$3`)
  .replace(/#(.+?)__(.+?)__#/g, `$1`)
  let totalWordCount = singleLine.length
  let kanjiExistence = /[々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]/.test(singleLine) ? true : false
  let kanjiCount = kanjiExistence === true ? singleLine.match(/[々〇〻\u3400-\u9FFF\uF900-\uFAFF\uD840-\uD87F\uDC00-\uDFFF]/g).join(``).length : 0
  return countParenthesis(singleLine, parenthesisArray)
  .then(async rly => {
    return [totalWordCount, kanjiCount, rly]
  })
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
}
