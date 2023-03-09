const PDFDocument = require('pdfkit')
const fs = require('fs')

module.exports = {
  buildAnimalsPDF,
}

const doc = new PDFDocument()

function buildAnimalsPDF(bugs, filename = 'bug.pdf') {
  return new Promise((resolve, reject) => {
    doc.pipe(fs.createWriteStream(filename))
    bugs.forEach((bug) =>
      doc
        .fontSize(25)
        .text(`Bug: ${bug.title} ,Problem: ${bug.description}`)
    )
    doc.end()
  })
}