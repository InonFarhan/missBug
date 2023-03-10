const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const port = 3031

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

// Bug API

app.get('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken) || null

    const filterBy = {
        txt: req.query.txt || '',
        severity: +req.query.severity || 0,
        label: req.query.label || [],
        sortType: req.query.sortType || '',
        sortDesc: req.query.sortDesc || 1,
        page: req.query.page || 0,
        isUserPage: req.query.isUserPage || false
    }

    bugService.query(filterBy, loggedinUser)
        .then(results => res.send(results))
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
    const { title, description, severity, createdAt, labels, creator } = req.body
    const bug = { title, description, severity, createdAt, labels, creator }
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove bug')
        })
})

// Users

app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load users')
        })
})

app.put('/api/user/:userId', (req, res) => {
    const { _id, username, fullname, password } = req.body
    const user = { _id, username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.listen(port, () => console.log(`Server ready at port http://localhost:${port}`))
