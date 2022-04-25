const { Feedback } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Feedback.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Feedback.findOne({
            where: { id },
            include: []
        })
        if(!foundInstance) throw 'no such Feedback'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Feedback catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Feedback.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: []
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Feedback catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Feedback.create(params)

        //relation settings
        // if (params.News) await createdInstance.setNews(params.News)
        const sendData = await Feedback.findOne({
            where: { id: createdInstance.id },
            include: []
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Feedback catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Feedback.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Feedback'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        // if(params.News) await updatedInstance.setNews(params.News)
        const sendData = await Feedback.findOne({
            where: { id: foundInstance.id },
            include: []
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Feedback catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Feedback.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Feedback'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Feedback catch', e)
        res.status(500).json({ error: e })
    }
}