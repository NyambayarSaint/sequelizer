const { Material } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Material.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Material.findOne({
            where: { id },
            include: ["documents"]
        })
        if(!foundInstance) throw 'no such Material'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Material catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Material.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["documents"]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Material catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Material.create(params)

        //relation settings
        if (params.documents) await createdInstance.setDocuments(params.documents)
        const sendData = await Material.findOne({
            where: { id: createdInstance.id },
            include: ["documents"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Material catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Material.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Material'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.documents) await updatedInstance.setDocuments(params.documents)
        const sendData = await Material.findOne({
            where: { id: foundInstance.id },
            include: ["documents"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Material catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Material.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Material'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Material catch', e)
        res.status(500).json({ error: e })
    }
}