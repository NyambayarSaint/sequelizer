const { Department } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Department.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Department.findOne({
            where: { id }
        })
        if(!foundInstance) throw 'no such Department'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Department catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Department.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            }
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Department catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Department.create(params)

        //relation settings
        // if (params.images) await createdInstance.setImages(params.images)
        const sendData = await Department.findOne({
            where: { id: createdInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Department catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Department.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Department'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        // if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await Department.findOne({
            where: { id: foundInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Department catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Department.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Department'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Department catch', e)
        res.status(500).json({ error: e })
    }
}