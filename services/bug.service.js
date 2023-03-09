const fs = require('fs')
const gBugs = require('../data/bugs.json')
const download = require('download-pdf')
const PdfService = require('./pdfService.js')
const PAGE_SIZE = 3

module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy, loggedinUser) {
    let bugs = gBugs.filter((bug) => {
        if (!(bug.title.includes(filterBy.txt))) return false
        if ((bug.severity < filterBy.severity)) return false
        if (filterBy.label && bug.labels.length) return bug.labels.some(label => (label.includes(filterBy.label)))
        return true
    })

    bugs.sort((bug1, bug2) => (bug1[filterBy.sortType] - bug2[filterBy.sortType]) * filterBy.sortDesc)

    if (filterBy.page) {
        const startIdx = filterBy.page * PAGE_SIZE
        bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    if (filterBy.isUserPage === 'true') bugs = bugs.filter((bug) => bug.creator._id === loggedinUser._id)

    const totalPages = Math.ceil(gBugs.length / PAGE_SIZE)
    return Promise.resolve({ totalPages, currBugs: bugs })
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unknown bug')
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknonwn bug')
    if (loggedinUser.isAdmin === "false" && gBugs[idx].creator._id !== loggedinUser._id) return Promise.reject('Not your bug')
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    var savedBug
    if (bug._id) {
        const idx = gBugs.findIndex(currBug => currBug._id === bug._id)
        gBugs[idx] = bug
    } else {
        savedBug = {
            _id: _makeId(),
            title: bug.title,
            severity: bug.severity,
            description: bug.description,
            labels: bug.labels,
            createdAt: bug.createdAt,
            creator: bug.creator
        }
        gBugs.push(savedBug)
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
        const data = JSON.stringify(gBugs, null, 2)

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