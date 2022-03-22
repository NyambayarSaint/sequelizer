const { Newstype } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Newstype.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Newstype.findOne({
            where: { id },
            include: ["News"]
        })
        if(!foundInstance) throw 'no such Newstype'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Newstype catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Newstype.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["News"]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Newstype catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Newstype.create(params)

        //relation settings
        if (params.News) await createdInstance.setNews(params.News)
        const sendData = await Newstype.findOne({
            where: { id: createdInstance.id },
            include: ["News"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Newstype catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Newstype.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Newstype'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.News) await updatedInstance.setNews(params.News)
        const sendData = await Newstype.findOne({
            where: { id: foundInstance.id },
            include: ["News"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Newstype catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Newstype.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Newstype'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Newstype catch', e)
        res.status(500).json({ error: e })
    }
}