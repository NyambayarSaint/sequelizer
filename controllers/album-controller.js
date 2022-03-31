const { Album } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Album.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Album.findOne({
            where: { id },
            include: ["images"]
        })
        if(!foundInstance) throw 'no such Album'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Album catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Album.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["images"]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Album catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Album.create(params)

        //relation settings
        if (params.images) await createdInstance.setImages(params.images)
        const sendData = await Album.findOne({
            where: { id: createdInstance.id },
            include: ["images"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Album catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Album.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Album'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await Album.findOne({
            where: { id: foundInstance.id },
            include: ["images"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Album catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Album.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Album'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Album catch', e)
        res.status(500).json({ error: e })
    }
}