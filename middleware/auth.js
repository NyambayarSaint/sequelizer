const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { Admin, AdminRole, UserRole, Permission } = require('../models')
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

        if(decoded.user) {
            type = 'user'
            foundUser = await User.findOne({ where: { id: Number(decoded.id) }, include: [{ model: UserRole, include: [Permission] }] })
        }
        else {
            type = 'admin'
            foundUser = await Admin.findOne({ where: { id: decoded.id }, include: [{ model: AdminRole, include: [Permission] }] })
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
