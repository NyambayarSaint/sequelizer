const { default: axios } = require("axios")
const { Company, Department, User } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

exports.count = async (req, res) => {
    try {
        const allInstances = await Company.findAll()
        res.status(200).json(allInstances.length)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.findOne = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Company.findOne({
            where: { id },
            include: ["File", "Departments"]
        })
        if (!foundInstance) throw 'no such Company'

        res.status(200).json(foundInstance)
    } catch (e) {
        console.log('get Company catch', e)
        res.status(500).json({ error: e })
    }
}

exports.find = async (req, res) => {
    try {
        const filledParams = fillQueryParams(req.query)

        const allInstances = await Company.findAll({
            ...filledParams.params,
            where: {
                ...filledParams.operations
            },
            include: ["File", "Departments"]
        })
        res.status(200).json(allInstances)
    } catch (e) {
        console.log('getAll Company catch', e)
        res.status(500).json({ error: e })
    }
}

exports.create = async (req, res) => {
    try {
        const params = { ...req.body }
        const createdInstance = await Company.create(params)

        //relation settings
        if (params.File) await createdInstance.setFile(params.File)
        const sendData = await Company.findOne({
            where: { id: createdInstance.id },
            include: ["File", "Department"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('create Company catch', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try {
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Company.findOne({ where: { id } })
        if (!foundInstance) throw 'No such Company'

        const updatedInstance = updateHelper(foundInstance, params, [])
        await updatedInstance.save()

        //relation settings
        if (params.File) await updatedInstance.setFile(params.File)
        const sendData = await Company.findOne({
            where: { id: foundInstance.id },
            include: ["File", "Department"]
        })

        res.status(200).json(sendData)
    } catch (e) {
        console.log('update Company catch', e)
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.params

        const foundInstance = await Company.findOne({ where: { id } })
        if (!foundInstance) throw 'no such Company'

        await foundInstance.destroy()

        res.status(200).json({ message: 'successfully deleted!' })
    } catch (e) {
        console.log('delete Company catch', e)
        res.status(500).json({ error: e })
    }
}

exports.init = async (req, res) => {
    const base = "http://192.168.10.11:8082"
    try {
        const { data: { access_token: access_token } } = await axios.post(base + '/api/auth-service/login', {
            userid: "S.Nyamaa",
            password: "Popersia1997n.",
            companyid: "cnt",
            ipaddress: "string",
            macaddress: "string"
        })
        const headers = { 'Authorization': 'Bearer ' + access_token }
        const { data: { retdata: companies } } = await axios(base + '/api/hrms/hr/kpi/get-company-dropdown', { headers })
        await Promise.all(companies.map(async company => {
            let foundCompany = await Company.findOne({ where: { id: company.companyid } })
            if (!foundCompany) foundCompany = await Company.create({ id: company.companyid, name: company.name })

            const { data: { retdata: departments } } = await axios(`${base}/api/hrms/hr/kpi/get-department-dropdown?companyid=${foundCompany.id}`, { headers })
            const { data: { retdata: employees } } = await axios(`${base}/api/hrms/hr/kpi/get-employee-dropdown?companyid=${foundCompany.id}`, { headers })

            await Promise.all(departments.map(async department => {
                let foundDepartment = await Department.findOne({ where: { id: department.depid } })
                if (!foundDepartment) foundCompany = await Department.create({ id: department.depid, name: department.name })
                await foundDepartment.setCompany(foundCompany.id)

                // await Promise.all(employees.map(async emp => {
                //     if (emp.depname === foundDepartment.name) {
                //         let foundUser = await User.findOne({ where: { id: emp.empid } })
                //         if (!foundUser) foundUser = await User.create({ id: emp.empid, code: emp.code, fullname: emp.fullname, posname: emp.posname })
                //         await foundUser.setDepartment(foundDepartment.id)
                //     }
                // }))

            }))

            // const employeeDetails = await Promise.all(employees.map(async employee => {
            //     const {data: {retdata: detail}} = await axios(`${base}/api/hrms/hr/employee/get?EmployeeID=${employee.empid}`, {headers})
            //     console.log(detail[0], 'here')
            //     return detail[0]
            // }))
            // if(company.companyid === 'CNT') console.log(employeeDetails)

        }))
        res.status(200).json({ message: 'success' })
    } catch (e) {
        console.log('init fail catch', e)
        res.status(500).json({ error: e })
    }

}