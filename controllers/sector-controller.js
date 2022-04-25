const { Sector } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Sector.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Sector.findOne({
            where: { id }
        })
        if(!foundInstance) throw 'no such Sector'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Sector catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Sector.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            }
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Sector catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Sector.create(params)

        //relation settings
        // if (params.images) await createdInstance.setImages(params.images)
        const sendData = await Sector.findOne({
            where: { id: createdInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Sector catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Sector.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Sector'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        // if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await Sector.findOne({
            where: { id: foundInstance.id }
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Sector catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Sector.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Sector'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Sector catch', e)
        res.status(500).json({ error: e })
    }
}