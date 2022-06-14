const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10
const ejs = require('ejs')
const Datastore = require('nedb')
const loginsDB = new Datastore('logins.db')
loginsDB.loadDatabase()
const usersDB = new Datastore('users.db')
usersDB.loadDatabase()

app.use(bodyParser.json())
app.use('/', express.static('../public'))
app.use('/favicon.ico', express.static('../public/assets/bobert.ico'))


function generateKey(startWith, len) {
    let key = `${startWith}_`
    for (let i = 0; i < len; i ++) {
        key += String.fromCharCode(94 + Math.floor(Math.random() * 24))
    }
    return key
}

function generateUID() {
    let id = 'uid_'
    for (let i = 0; i < 26; i ++) {
        id += Math.floor(Math.random() * 10)
    }
    
    if (loginsDB.find({ accountId: id })[0]) return generateAccountId()

    return id
}

app.post('/api/signup', async (req, res) => {
    const { username, displayname, password } = req.body

    // if (data.password.length < 6) {
    //     res.json({
    //         status: 'too short'
    //     })
    //     return
    // }

    try {
        const uid = generateUID()
        usersDB.insert({
            username: username,
            uid: uid,
            displayname: displayname
        })
        loginsDB.insert({
            username: username,
            password: await bcrypt.hash(password, saltRounds),
            uid: uid,
            keys: {
                pk: generateKey('pk', 35),    // projects key
                dk: generateKey('dk', 35),      // discussions key
                pfk: generateKey('pfk', 35),    // profile key
                nk: generateKey('nk', 35)       // notifs key
            }
        })
    } catch(e) {
        console.log(e)
        res.json({
            status: 'error'
        })
    } finally {
        res.json({
            status: 'ok'
        })
    }
})

// super insecure :P
let passwordMatched = false
app.post('/api/login', login)

async function login(req, res) {
    const { username, password } = req.body

    console.log('Attemping login')

    try {
        (function () {
            loginsDB.find({ username: username }, function (err, data) {
                if (!data[0]) {
                    console.log('User does not exist')
                    return
                }
                bcrypt.compare(password, data[0].password, function (err, matched) {
                    if (err) {
                        console.error(err)
                        return
                    }
                    if (!matched === true) return

                    res.json({
                        status: 200,
                        body: {
                            uid: data[0].uid,
                            pk: data[0].keys.pk,
                            dk: data[0].keys.dk,
                            pfk: data[0].keys.pfk,
                            nk: data[0].keys.nk
                        }
                    })
                })
            })
        })()
    } catch(e) {
        console.log('Error logging in: ', e)
        res.json({
            status: 'error'
        })
    }

    loginsDB.loadDatabase()
}

app.get('/profile/:user', function(req, res) {
    usersDB.find({ username: req.params.user }, function(err, data) {
        ejs.renderFile('profilePage.ejs', {
            profile: {
                username: 'bobert',
                displayname: 'Bobert',
                uid: 'uid_bobert',
                avatar: '/assets/bobert.png',
                background: '/assets/bobert-sun.png'
            },
            account: {
                username: 'shipment22',
                displayname: 'boberts father',
                uid: 'not a real uid',
                notifications: [
                    {
                        author: 'joe',
                        authorUID: 'not actual uid',
                        postedIn: 'not an actual program id',
                        content: 'hello :)',
                        time: 'not the actual time'
                    },
                    {
                        author: 'john',
                        authorUID: 'also not a uid',
                        postedIn: 'diferent program that doesn\'t exist',
                        content: 'the content of another message',
                        time: 'a time'
                    },
                ]
            }
        }, {}, function(err, str) {
            if (err) res.send('Error: ' + error)
            res.send(str)
        })
    })
})

app.listen(5000)
