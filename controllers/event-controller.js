const { Event, User, Op } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try {
        const allInstances = await Event.findAll()
        res.status(200).json(allInstances.length)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Event.findOne({
            where: { id },
            include: ["users"]
        })
        if (!foundInstance) throw 'no such Event'

        res.status(200).json(foundInstance)
    } catch (e) {
        console.log('get Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Event.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["users", "Company"]
        })

        res.status(200).json(allInstances)
    } catch (e) {
        console.log('getAll Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.findWithBirthdays = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Event.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations,
                CompanyId: { [Op.or]: ["TBG", req.user.CompanyId] }
            },
            include: ["users"]
        })
        const users = await User.findAll({ where: { CompanyId: req.user.CompanyId }, include: "File" });
        const arrayToSend = []
        users.map(user => {
            const birthdate = new Date(user.details.birthdate)
            arrayToSend.push({
                start_date: birthdate,
                end_date: birthdate,
                sortArg: birthdate.getDate(),
                birthdate: birthdate.getMonth() + 1 + '.' + birthdate.getDate(),
                fullname: user.details.lastname.charAt(0) + '.' + user.details.firstname,
                image: user.File ? user.File : user.details.picturetumb ? user.details.picturetumb : null,
                position: user.details.posname,
                phone: user.details.mobilephone,
                company: user.details.companyname,
                isBirthday: true
            })
        })

        res.status(200).json([...arrayToSend, ...allInstances])
    } catch (e) {
        console.log('getAll Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Event.create(params)

        if(params.type === 1) createdInstance.setCompany("TBG")
        if(params.type === 2) createdInstance.setCompany(req.user.CompanyId)

        res.status(200).json(createdInstance)
    } catch (e) {
        console.log('create Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Event.findOne({ where: { id } })
        if (!foundInstance) throw 'No such Event'

        const updatedInstance = updateHelper(foundInstance, params, [])
        if(params.type === 1) updatedInstance.CompanyId = "TBG"
        if(params.type === 2) updatedInstance.CompanyId = req.user.CompanyId
        await updatedInstance.save()

        res.status(200).json(updatedInstance)
    } catch (e) {
        console.log('update Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Event.findOne({ where: { id } })
        if (!foundInstance) throw 'no such Event'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch (e) {
        console.log('delete Event catch', e)
        res.status(500).json({ error: e })
    }
}