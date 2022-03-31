const { Event } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Event.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Event.findOne({
            where: { id },
            include: ["users"]
        })
        if(!foundInstance) throw 'no such Event'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Event.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["users"]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Event.create(params)

        //relation settings
        if (params.users) await createdInstance.setUsers(params.users)
        const sendData = await Event.findOne({
            where: { id: createdInstance.id },
            include: ["users"]
        })

        res.status(200).json(sendData)
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
        if(!foundInstance) throw 'No such Event'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.users) await updatedInstance.setUsers(params.users)
        const sendData = await Event.findOne({
            where: { id: foundInstance.id },
            include: ["users"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Event catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Event.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Event'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Event catch', e)
        res.status(500).json({ error: e })
    }
}