const { Material, Folder } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.getMaterialsByFolderId = async (req, res) => {
    try{
        const { id } = req.params
        const materials = await Material.findAll({ include: [{ model: Folder, where: { id } }, "files"] })
        res.status(200).json(materials)
    } catch(e) {
        console.log('getMaterialsByFolderId catch', e)
        res.status(500).json({ error: e })
    }
}

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
            include: ["files"]
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
            include: ["files"]
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
        if (params.files) await createdInstance.setFiles(params.files)
        const sendData = await Material.findOne({
            where: { id: createdInstance.id },
            include: ["files"]
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
        if(params.files) await updatedInstance.setFiles(params.files)
        const sendData = await Material.findOne({
            where: { id: foundInstance.id },
            include: ["files"]
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