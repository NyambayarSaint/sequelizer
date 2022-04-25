const { User, UserRole, Permission, File, Department, Company, Op, sequelize } = require('../models')
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")
const companyController = require('../controllers/company-controller')

exports.getBirthdays = async (req, res) => {
    try {
        const users = await User.findAll({ include: "File" });
        const arrayToSend = []
        users.map(user => {
            const currentdate = new Date()
            const birthdate = new Date(user.details.birthdate)
            if (currentdate.getMonth() + 0 === birthdate.getMonth()) {
                if (currentdate.getDate() <= birthdate.getDate()) {
                    arrayToSend.push({
                        sortArg: birthdate.getDate(),
                        birthdate: birthdate.getMonth() + 1 + '.' + birthdate.getDate(),
                        fullname: user.details.lastname.charAt(0) + '.' + user.details.firstname,
                        image: user.File ? user.File : user.details.picturetumb ? user.details.picturetumb : null,
                        position: user.details.posname,
                        phone: user.details.mobilephone,
                        company: user.details.companyname
                    })
                }
            }
        })
        arrayToSend.sort((a, b) => (a.sortArg > b.sortArg) ? 1 : -1)
        res.status(200).json(arrayToSend)
    } catch (e) {
        console.log('getBirthdays error', e)
        res.status(500).json({ error: e })
    }
}

exports.count = async (req, res) => {
    try {
        const allInstances = await User.findAll()
        res.status(200).json(allInstances.length)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await User.create(params)

        //relation settings
        if (params.File) await createdInstance.setFile(params.File)
        if (params.UserRole) await createdInstance.setUserRole(params.UserRole)

        const token = await createdInstance.generateAuthToken()

        res.status(200).json({ jwt: token })
    } catch (e) {
        console.log('create User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.signin = async (req, res) => {
    const { username, password } = req.body
    try {
        const { user, error, errorDetails, loadNewUsers, credentials, EmpID } = await User.findByCredentials(username, password);
        if (error) throw new Error(errorDetails)
        else {
            if (loadNewUsers) {
                console.log('caught here')
                const newUser = await companyController.loadUsers2(credentials, EmpID)
                return res.status(200).json({ jwt: await newUser.generateAuthToken() })
            } else return res.status(200).json({ jwt: await user.generateAuthToken() })
        }
    } catch (e) {
        console.log('sign in catch', e)
        res.status(401).json({ error: e })
    }
}
exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await User.findOne({ where: { id } })
        if (!foundInstance) throw 'No such User'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if (params.File) await updatedInstance.setFile(params.File)
        if (params.UserRole) await updatedInstance.setUserRole(params.UserRole)
        const sendData = await User.findOne({
            where: { id: foundInstance.id },
            include: ["File", "UserRole"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await User.findOne({ where: { id } })
        if (!foundInstance) throw 'no such User'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch (e) {
        console.log('delete User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await User.findOne({
            where: { id },
            include: [
                { model: UserRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })
        if (!foundInstance) throw 'no such User'

        res.status(200).json(foundInstance)
    } catch (e) {
        console.log('get User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.me = async (req, res) => {
    try {
        const userDetail = await User.findOne({
            where: { id: req.user.id },
            include: [
                { model: UserRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })

        return res.status(200).json({ user: userDetail });
    } catch (e) {
        return res.status(500).json({ error: e })
    }
}
exports.find = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await User.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: [
                { model: UserRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })
        res.status(200).json(allInstances)
    } catch (e) {
        console.log('getAll User catch', e)
        res.status(500).json({ error: e })
    }
}
exports.search = async (req, res) => {
    try {
        let { searchValue } = req.body
        searchValue = searchValue.toLowerCase()
        let foundInstances = []
        if(isNaN(searchValue)){
            if(/[а-яА-ЯЁё]/.test(searchValue)){
                foundInstances = await User.findAll({ where: { firstname: sequelize.where(sequelize.fn('LOWER', sequelize.col('firstname')), 'LIKE', '%' + searchValue + '%') } })
            } else {
                foundInstances = await User.findAll({ where: { firstname_enus: sequelize.where(sequelize.fn('LOWER', sequelize.col('firstname_enus')), 'LIKE', '%' + searchValue + '%') } })
            }
        } else {
            foundInstances = await User.findAll({ where: { mobilephone: { [Op.like]: '%' + searchValue + '%' } } })
        }
        // const allInstances = User.findAll()
        res.status(200).json(foundInstances)
    } catch (e) {
        console.log('getAll User catch', e)
        res.status(500).json({ error: e })
    }
}

