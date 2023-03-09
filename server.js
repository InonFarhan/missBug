const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3031

const bugService = require('./services/bug.service')

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        label: req.query.label || [],
        sortType: req.query.sortType || '',
        sortDesc: req.query.sortDesc || 1,
        page: req.query.page || 0,
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load bugs')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, description, severity, createdAt, labels } = req.body
    const bug = { _id, title, description, severity, createdAt, labels }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})

app.post('/api/bug', (req, res) => {
    const { title, description, severity, createdAt, labels } = req.body
    const bug = { title, description, severity, createdAt, labels }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Cannot save bug, Error:', err)
            res.status(400).send('Cannot save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            var visitedBugs = JSON.parse(req.cookies.visitedBugs || "[]")
            if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
            if (visitedBugs.length > 3) return res.status(401).send('Wait for a bit')
            visitedBugs = JSON.stringify(visitedBugs)
            res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
            res.send(bug)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove bug')
        })
})

app.listen(port, () => console.log(`Server ready at port http://localhost:${port}!`))
