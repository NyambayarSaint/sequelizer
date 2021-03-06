const { News, Company } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.getNews = async (req, res) => {
    try {
        const { id: type } = req.params
        let newsToSend
        if(Number(type) === 1) newsToSend = await News.findAll({ include: [ { model: Company, where: { id: "TBG" } }]})
        if(Number(type) === 2) {
            const depInstance = await req.user.getDepartment({ include: "Company" })
            newsToSend = await News.findAll({ include: [{ model: Company, where: {id: depInstance.Company.id} }] })
        }
        res.status(200).json(newsToSend)
    } catch (e) {
        console.log('getNews', e)
        res.status(500).json({ error: e })
    }
}

exports.count = async (req, res) => {
    try{
        const filledParams = fillQueryParams(req.query)
        if(req.query.type) filledParams.operations.NewstypeId = Number(req.query.type)
        const allInstances = await News.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            }
        })
        res.status(200).json(allInstances.length)
    } catch(e) {
        console.error('countNews', e.message)
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
        const params = req.query
        if(params.type) filledParams.operations.NewstypeId = Number(params.type)
        console.log(filledParams.operations, 'haha')
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
        if (params.type === 1) { // SET GROUP COMPANY
            const headCompany = await Company.findOne({ where: { id: "TBG" } })
            await createdInstance.setCompany(headCompany.id)
        }
        if (params.type === 2) { // SET COMPANY
            const depInstance = await req.user.getDepartment({ include: "Company" })
            await createdInstance.setCompany(depInstance.Company.id)
        }
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
        if (params.type === 1) { // SET GROUP COMPANY
            const headCompany = await Company.findOne({ where: { id: "TBG" } })
            await foundInstance.setCompany(headCompany.id)
        }
        if (params.type === 2) { // SET COMPANY
            const depInstance = await req.user.getDepartment({ include: "Company" })
            await foundInstance.setCompany(depInstance.Company.id)
        }
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