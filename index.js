const groupBy = require('lodash/groupBy')
const FILLER_CHARACTER = 'Q'

// These could be provided as command line variables, but for this simple application, this was quicker and easier
// Replace the contents of ciphertext with the text to be decoded
const ciphertext =
  'IookowaIaapatteolbtoyefsethvbeollkaopaignhsahradietnmslnwnteifnigsotepblopeteselhnriayhlteraoenfrtlyludsoeebfrmIacetndntnwhtmyperohwrdutmslIemoaeennyiebylynoteesoendvrigyefoadhnnidnamohreberrtirhltaodnrwiehgetcaotuhaalnicvrdeoeesaNwo'
// Replace with the number of columns you wish to solve for
const numberOfColumns = 2

function containsRange(val, start, end) {
  if (start !== end) {
    for (let i = start; i <= end; i++) {
      if (val.includes(i)) {
        return true
      }
    }
  }
  return false
}

// This is a utility I got from Stack Overflow - I didn't write it
function pad(n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

// This is a utility I got from Stack Overflow - I didn't write it
function is_unique(str) {
  var obj = {}
  for (var z = 0; z < str.length; ++z) {
    var ch = str[z]
    if (obj[ch]) return false
    else obj[ch] = true
  }
  return true
}

let maxValString = ''
for (let i = 0; i < numberOfColumns; i++) {
  maxValString += '9'
}
const maxVal = parseInt(maxValString)

for (let k = 0; k < maxVal; k++) {
  // This is the ordering of the columns that we're going to attempt
  const order = pad(k, numberOfColumns)
  const isValidOrder =
    !order.includes(0) &&
    is_unique(order) &&
    !containsRange(order, numberOfColumns + 1, 9)
  if (isValidOrder) {
    const columns = []
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push([])
    }
    const lengthOfColumn = Math.ceil(ciphertext.length / numberOfColumns)
    const numberOfFillers = lengthOfColumn * numberOfColumns - ciphertext.length
    let stringWithFillers = ''
    let positionInColumn = 1
    let columnNumber = 1
    const columnsWithFiller = order.substr(order.length - numberOfFillers)
    for (let c of ciphertext) {
      const shouldAddFiller =
        positionInColumn === lengthOfColumn &&
        columnsWithFiller.includes(columnNumber)
      if (positionInColumn === lengthOfColumn) {
        positionInColumn = 0
        columnNumber += 1
      }
      if (shouldAddFiller) {
        stringWithFillers += FILLER_CHARACTER
        positionInColumn += 1
      }
      stringWithFillers += c
      positionInColumn += 1
    }
    if (stringWithFillers.length % numberOfColumns !== 0) {
      stringWithFillers += FILLER_CHARACTER
    }
    for (let i = 0; i < stringWithFillers.length; i++) {
      columns[Math.floor(i / lengthOfColumn)].push(stringWithFillers[i])
    }
    let finalString = ''
    for (let i = 0; i < columns[0].length; i++) {
      for (let j = 0; j < numberOfColumns; j++) {
        finalString += columns[order[j] - 1][i]
      }
    }
    // The commented out lines below allow for filtering of the results based on a known (or suspected) word
    //if (finalString.includes('and')) {
    console.log('order: ', order)
    console.log(finalString)
    //}
  }
}
