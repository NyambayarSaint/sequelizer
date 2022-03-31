const { Jobposting, Company, File } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try{
        const allInstances = await Jobposting.findAll()
        res.status(200).json(allInstances.length)
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Jobposting.findOne({
            where: { id },
            include: [{
                model: Company,
                include: [File]
            }]
        })
        if(!foundInstance) throw 'no such Jobposting'

        res.status(200).json(foundInstance)
    } catch(e){
        console.log('get Jobposting catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Jobposting.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: [{
                model: Company,
                include: [File]
            }]
        })
        res.status(200).json(allInstances)
    } catch(e) {
        console.log('getAll Jobposting catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Jobposting.create(params)

        //relation settings
        if (params.Company) await createdInstance.setCompany(params.Company)
        const sendData = await Jobposting.findOne({
            where: { id: createdInstance.id },
            include: ["Company"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Jobposting catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Jobposting.findOne({ where: { id } })
        if(!foundInstance) throw 'No such Jobposting'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if(params.Company) await updatedInstance.setCompany(params.Company)
        const sendData = await Jobposting.findOne({
            where: { id: foundInstance.id },
            include: ["Company"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Jobposting catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { id } = req.params

        const foundInstance = await Jobposting.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Jobposting'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch(e) {
        console.log('delete Jobposting catch', e)
        res.status(500).json({ error: e })
    }
}