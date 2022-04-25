const { Unit } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Unit.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Unit.findOne({
            where: { id }
        })
        if(!foundInstance) throw 'no such Unit'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Unit catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Unit.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            }
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Unit catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Unit.create(params)

        //relation settings
        // if (params.images) await createdInstance.setImages(params.images)
        const sendData = await Unit.findOne({
            where: { id: createdInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Unit catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Unit.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Unit'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        // if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await Unit.findOne({
            where: { id: foundInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Unit catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Unit.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Unit'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Unit catch', e)
        res.status(500).json({ error: e })
    }
}