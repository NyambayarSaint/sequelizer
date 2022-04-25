const { Post, User } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Post.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Post.findOne({
            where: { id },
            include: ["File", { model: User, include: "File" }]
        })
        if(!foundInstance) throw 'no such Post'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Post catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Post.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["File", { model: User, include: "File" }]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Post catch', e)
        res.status(500).json({ error: e })
    }
}
exports.my = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)
        const allInstances = await Post.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations,
                UserId: req.user.id
            },
            include: ["File"]
        })
        res.status(200).json(allInstances)
    } catch(e){
        console.log('getMy Post catch', e)
        res.status(500).json({error: e})
    }
}
exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Post.create(params)

        //relation settings
        if (params.images) await createdInstance.setImages(params.images)
        const sendData = await Post.findOne({
            where: { id: createdInstance.id },
            include: ["File", { model: User, include: "File" }]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Post catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Post.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Post'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.images) await updatedInstance.setImages(params.images)
        const sendData = await Post.findOne({
            where: { id: foundInstance.id },
            include: ["File", { model: User, include: "File" }]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Post catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Post.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Post'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Post catch', e)
        res.status(500).json({ error: e })
    }
}