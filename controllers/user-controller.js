const { User, UserRole, Permission, File } = require('../models')
const bcrypt = require('bcryptjs');
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try {
        const allInstances = await User.findAll()
        res.status(200).json(allInstances.length)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await User.create(params)

        //relation settings
        if (params.File) await createdInstance.setFile(params.File)
        if (params.UserRole) await createdInstance.setUserRole(params.UserRole)

        const token = await createdInstance.generateAuthToken()

        res.status(200).json({ jwt: token })
    } catch (e) {
        console.log('create User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.signin = async (req, res) => {
    const { username, password } = req.body
    try {
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        return res.status(200).json({ jwt: token });
    } catch (e) {
        console.log('sign in catch', e)
        res.status(401).json({ error: e })
    }
}
exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await User.findOne({ where: { id } })
        if (!foundInstance) throw 'No such User'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if (params.File) await updatedInstance.setFile(params.File)
        if (params.UserRole) await updatedInstance.setUserRole(params.UserRole)
        const sendData = await User.findOne({
            where: { id: foundInstance.id },
            include: ["File", "UserRole"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await User.findOne({ where: { id } })
        if (!foundInstance) throw 'no such User'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch (e) {
        console.log('delete User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await User.findOne({
            where: { id },
            include: [
                {
                    model: UserRole,
                    include: [Permission]
                },
                {
                    model: File
                }
            ]
        })
        if (!foundInstance) throw 'no such User'

        res.status(200).json(foundInstance)
    } catch (e) {
        console.log('get User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.me = async (req, res) => {
    const userDetail = await User.findOne({ where: { id: req.user.id }, include: [{ model: UserRole, include: [Permission] }, { model: File }] })
    return res.status(200).json({ user: userDetail });
}
exports.find = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await User.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: [
                {
                    model: UserRole,
                    include: [Permission]
                },
                {
                    model: File
                }
            ]
        })
        res.status(200).json(allInstances)
    } catch (e) {
        console.log('getAll User catch', e)
        res.status(500).json({ error: e })
    }
}