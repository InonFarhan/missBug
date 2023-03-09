
const fs = require('fs')
const bugs = require('../data/bugs.json')
const download = require('download-pdf')
const PdfService = require('./pdfService.js')
const PAGE_SIZE = 3

module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy) {
    let currBugs = bugs.filter((bug) => {
        if (!(bug.title.includes(filterBy.txt))) return false
        if ((bug.severity < filterBy.severity)) return false
        if (filterBy.label && bug.labels.length) return bug.labels.some(label => (label.includes(filterBy.label)))
        return true
    })
    currBugs = currBugs.sort((a, b) => {
        if (a[filterBy.sortType] > b[filterBy.sortType]) return (-1 * filterBy.sortDesc)
        if (a[filterBy.sortType] < b[filterBy.sortType]) return (1 * filterBy.sortDesc)
        return 0
    })
    if (filterBy.page) {
        const startIdx = filterBy.page * PAGE_SIZE
        currBugs = currBugs.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(currBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unknown bug')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknonwn bug')

    bugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    var savedBug
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        bugs[idx] = bug
    } else {
        savedBug = {
            _id: _makeId(),
            title: bug.title,
            severity: bug.severity,
            description: bug.description,
            labels: bug.labels,
            createdAt: bug.createdAt
        }
        bugs.push(savedBug)
    }
    return _saveBugsToFile().then(() => {
        return savedBug
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)

        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

function downloadPdf(files) {
    let url = PdfService.buildAnimalsPDF(files)
    // let pdf = "http://localhost:3031/#/bug/NivW4"
    // let date = Date.now()
    // let options = {
    //     directory: `./pdfs`,
    //     filename: `${new Intl.DateTimeFormat('en-GB', { dateStyle: 'short' }).format(date)}.pdf`
    // }
    // download(pdf, options, function (err) {
    //     if (err) throw err
    //     console.log("meow")
    // })
}