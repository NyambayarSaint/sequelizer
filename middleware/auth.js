const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Admin } = require('../models')
const JWTSECRET = process.env.JWTSECRET

const CTS = process.env.CTS
const CTE = process.env.CTE

exports.userAuth = async (req, res, next) => {
    const decodedCookie = decodeURIComponent(req.headers.cookie)

    if (decodedCookie.includes(CTS)) {
        try {
            const start = decodedCookie.indexOf(CTS)
            const end = decodedCookie.lastIndexOf(CTE)
            const token = decodedCookie.slice(start + CTS.length, end)
            const decoded = jwt.verify(token, JWTSECRET)

            const foundUser = await User.findOne({ where: { id: decoded.id } }).catch(err => {
                console.log('couldnt find user', err)
            })

            if (!foundUser) {
                throw new Error('No user found!');
            }

            req.token = token
            req.user = foundUser
            // req.type = 'Co'

            next()
        } catch (e) {
            console.log('catching err', e)
            res.status(401).send('Session expired or not valid account!')
        }
    }
    else throw new Error('None of them!')
}

exports.adminAuth = async (req, res, next) => {
    try {
        const decodedCookie = decodeURIComponent(req.headers.authorization)
        if(!decodedCookie) throw 'no auth token cookie in header'
        console.log(decodedCookie, '??')
        const start = decodedCookie.indexOf('Bearer ')
        const token = decodedCookie.slice(start+7, decodedCookie.length)
        const decoded = jwt.verify(token, JWTSECRET)
        const foundUser = await Admin.findOne({ where: { id: decoded.id } }).catch(err => {
            console.log('couldnt find user', err)
        })

        if (!foundUser) {
            throw new Error('No user found!');
        }

        req.token = token
        req.user = foundUser
        // req.type = 'Co'

        next()
    } catch (e) {
        console.log('catching err', e)
        res.status(401).send('Session expired or not valid account!')
    }
}