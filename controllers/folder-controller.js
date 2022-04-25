const { Folder, Company, Department } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try {
        const allInstances = await Folder.findAll()
        res.status(200).json(allInstances.length)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Folder.findOne({
            where: { id },
            include: ["Company", "Department"]
        })
        if (!foundInstance) throw 'no such Folder'

        res.status(200).json(foundInstance)
    } catch (e) {
        console.log('get Folder catch', e)
        res.status(500).json({ error: e })
    }
}

exports.getFolders = async (req, res) => {
    try {
        const { id: type } = req.params
        let foldersToSend
        if(Number(type) === 1) foldersToSend = await Folder.findAll({ include: [ { model: Company, where: { id: "TBG" } }]})
        if(Number(type) === 2) {
            const compInstance = await req.user.getCompany()
            foldersToSend = await Folder.findAll({ include: [{ model: Company, where: {id: compInstance.id} }] })
        }
        // if(Number(type) === 3){
        //     const depInstance = await req.user.getDepartment()
        //     foldersToSend = await Folder.findAll({ include: [{ model: Department, where: {id: depInstance.id} }] })
        // }
        res.status(200).json(foldersToSend)
    } catch (e) {
        console.log('getFolders', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Folder.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["Company", "Department"]
        })
        res.status(200).json(allInstances)
    } catch (e) {
        console.log('getAll Folder catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Folder.create(params)

        //relation settings
        if (params.type === 1) { // SET GROUP COMPANY
            const headCompany = await Company.findOne({ where: { id: "TBG" } })
            await createdInstance.setCompany(headCompany.id)
        }
        if (params.type === 2) { // SET COMPANY
            const depInstance = await req.user.getDepartment({ include: "Company" })
            await createdInstance.setCompany(depInstance.Company.id)
        }
        if (params.type === 3) { // SET DEPARTMENT
            const depInstance = await req.user.getDepartment()
            await createdInstance.setDepartment(depInstance.id)
        }
        // if (params.files) await createdInstance.setFiles(params.files)
        const sendData = await Folder.findOne({
            where: { id: createdInstance.id },
            include: ["Company", "Department"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Folder catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Folder.findOne({ where: { id } })
        if (!foundInstance) throw 'No such Folder'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if (params.type === 1) { // SET GROUP COMPANY
            const headCompany = await Company.findOne({ where: { id: "TBG" } })
            await foundInstance.setCompany(headCompany.id)
        }
        if (params.type === 2) { // SET COMPANY
            const depInstance = await req.user.getDepartment({ include: "Company" })
            await foundInstance.setCompany(depInstance.Company.id)
        }
        if (params.type === 3) { // SET DEPARTMENT
            const depInstance = await req.user.getDepartment()
            await foundInstance.setDepartment(depInstance.id)
        }
        
        const sendData = await Folder.findOne({
            where: { id: foundInstance.id },
            include: ["Company", "Department"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Folder catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Folder.findOne({ where: { id } })
        if (!foundInstance) throw 'no such Folder'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch (e) {
        console.log('delete Folder catch', e)
        res.status(500).json({ error: e })
    }
}