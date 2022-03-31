const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Admin } = require('../models')
const JWTSECRET = process.env.JWTSECRET

exports.auth = async (req, res, next) => {
    try {
        const decodedCookie = decodeURIComponent(req.headers.authorization)
        if(!decodedCookie) throw 'no auth token cookie in header'

        const start = decodedCookie.indexOf('Bearer ')
        const token = decodedCookie.slice(start+7, decodedCookie.length)
        const decoded = jwt.verify(token, JWTSECRET)

        let foundUser
        let type = ''
        const isAdmin = await Admin.findOne({ where: { id: decoded.id } })
        const isUser = await User.findOne({ where: { id: decoded.id } })
        
        if(isAdmin) {
            foundUser = isAdmin
            type = 'admin'
        }
        if(isUser) {
            foundUser = isUser
            type = 'user'
        }

        if (!foundUser) {
            throw new Error('No user found!');
        }

        req.token = token
        req.user = foundUser
        req.type = type

        next()
    } catch (e) {
        console.log('catching err', e)
        res.status(401).send('Session expired or not valid account!')
    }
}