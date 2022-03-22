const { News } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await News.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await News.findOne({
            where: { id },
            include: ["images", "Newstype"]
        })
        if(!foundInstance) throw 'no such News'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get News catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await News.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["images", "Newstype"]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll News catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await News.create(params)

        //relation settings
        if (params.images) await createdInstance.setImages(params.images)
        const sendData = await News.findOne({
            where: { id: createdInstance.id },
            include: ["images"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create News catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await News.findOne({ where: { id } })
        if(!foundInstance) throw 'No such News'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await News.findOne({
            where: { id: foundInstance.id },
            include: ["images"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update News catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await News.findOne({ where: { id } })
        if(!foundInstance) throw 'no such News'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete News catch', e)
        res.status(500).json({ error: e })
    }
}