const { default: axios } = require("axios")
const { Company, Department, Sector, Unit, User, UserRole } = require("../models")
const { updateHelper, fillQueryParams } = require("../utils/micro-functions")

const convertDepChild = (depcodestr) => {
    const arrayToSend = []
    const seperated = depcodestr.split('.')
    seperated.forEach((s, index) => {
        let tmp = ''
        for (let i = -1; i < index; i++) { tmp = tmp + seperated[i + 1] + '.' }
        arrayToSend.push(tmp.slice(0, tmp.length - 1))
    })
    return structureArr(arrayToSend)
}
const structureArr = (array) => {
    if (array.length === 2) {
        return {
            key: array[0],
            hasChildren: true,
            children: {
                key: array[1],
                hasChildren: false
            }
        }
    }
    if (array.length === 3) {
        return {
            key: array[0],
            hasChildren: true,
            children: {
                key: array[1],
                hasChildren: true,
                children: {
                    key: array[2],
                    hasChildren: false
                }
            }
        }
    }
    if (array.length === 4) {
        return {
            key: array[0],
            hasChildren: true,
            children: {
                key: array[1],
                hasChildren: true,
                children: {
                    key: array[2],
                    hasChildren: true,
                    children: {
                        key: array[3],
                        hasChildren: false
                    }
                }
            }
        }
    }
}

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
            include: ["File"]
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
            include: ["File"]
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

            const [foundCompany, comCreated] = await Company.findOrCreate({ where: { id: company.companyid }, defaults: { name: company.name } })
            const { data: { retdata: departments } } = await axios(`${base}/api/hrms/hr/kpi/get-department-dropdown?companyid=${foundCompany.id}`, { headers })

            // for(let index = 0; index<departments.length; index++){
            //     if (departments[index].depcode.includes(".") && departments[index].depcode.split('.').length < 5) {
            //         const parent = convertDepChild(departments[index].depcode)
            //         const { children: lookForDepartment } = parent
            //         if(company.companyid === "CNT") console.log(lookForDepartment, 'lookForDepartment')
            //         Department.findOrCreate({ where: { depcode: lookForDepartment.key, CompanyId: foundCompany.id }, defaults: { name: departments[index].name, id: departments[index].depid } }).then(async depData => {
            //             const [foundDepartment, depCreated] = depData
            //             await foundDepartment.setCompany(foundCompany.id)
            //             if (lookForDepartment.hasChildren) {
            //                 const { children: lookForSector } = lookForDepartment
            //                 Sector.findOrCreate({ where: { depcode: lookForSector.key, CompanyId: foundCompany.id }, defaults: { name: departments[index].name, id: departments[index].depid } }).then(async secData => {
            //                     const [foundSector, secCreated] = secData
            //                     await foundSector.setCompany(foundCompany.id)
            //                     await foundSector.setDepartment(foundDepartment.id);
            //                     if (lookForSector.hasChildren) {
            //                         const { children: lookForUnit } = lookForSector
            //                         Unit.findOrCreate({ where: { depcode: lookForUnit.key, CompanyId: foundCompany.id }, defaults: { name: departments[index].name, id: departments[index].depid } }).then(async unitData => {
            //                             const [foundUnit, unitCreated] = unitData
            //                             await foundUnit.setCompany(foundCompany.id)
            //                             await foundUnit.setDepartment(foundDepartment.id)
            //                             await foundUnit.setSector(foundSector.id)
            //                         })
            //                     }
            //                 })
            //             }
            //         })
            //     } else {
            //         const [foundDepartment, depCreated] = await Department.findOrCreate({ where: { depcode: departments[index].depcode, CompanyId: foundCompany.id }, defaults: { name: departments[index].name, id: departments[index].depid } })
            //         await foundDepartment.setCompany(foundCompany.id)
            //     }
            // }

            await Promise.all(departments.map(async department => {

                if (department.depcode.includes(".") && department.depcode.split('.').length < 5) {
                    const parent = convertDepChild(department.depcode)
                    const { children: lookForDepartment } = parent
                    Department.findOrCreate({ where: { depcode: lookForDepartment.key, CompanyId: foundCompany.id }, defaults: { name: department.name, id: department.depid } }).then(async depData => {
                        const [foundDepartment, depCreated] = depData
                        await foundDepartment.setCompany(foundCompany.id)
                        if (lookForDepartment.hasChildren) {
                            const { children: lookForSector } = lookForDepartment
                            Sector.findOrCreate({ where: { depcode: lookForSector.key, CompanyId: foundCompany.id }, defaults: { name: department.name, id: department.depid } }).then(async secData => {
                                const [foundSector, secCreated] = secData
                                await foundSector.setCompany(foundCompany.id)
                                await foundSector.setDepartment(foundDepartment.id);
                                if (lookForSector.hasChildren) {
                                    const { children: lookForUnit } = lookForSector
                                    Unit.findOrCreate({ where: { depcode: lookForUnit.key, CompanyId: foundCompany.id }, defaults: { name: department.name, id: department.depid } }).then(async unitData => {
                                        const [foundUnit, unitCreated] = unitData
                                        await foundUnit.setCompany(foundCompany.id)
                                        await foundUnit.setDepartment(foundDepartment.id)
                                        await foundUnit.setSector(foundSector.id)
                                    })
                                }
                            })
                        }
                    })
                } else {
                    const [foundDepartment, depCreated] = await Department.findOrCreate({ where: { depcode: department.depcode, CompanyId: foundCompany.id }, defaults: { name: department.name, id: department.depid } })
                    await foundDepartment.setCompany(foundCompany.id)
                }
            }))
        }))
        res.status(200).json({ message: 'success' })
    } catch (e) {
        console.log('init fail catch', e)
        res.status(500).json({ error: e })
    }

}

exports.loadUsers2 = (credentials, EmpID) => {
    return new Promise(async (resolve, reject) => {
        const base = "http://192.168.10.11:8082"
        try {
            const { data: { access_token: access_token } } = await axios.post(base + '/api/auth-service/login', credentials)
            const { data: { retdata: users } } = await axios(base + '/api/hrms/hr/list/getemployeelist?status=AC&pageRecord=100000', { headers: { 'Authorization': 'Bearer ' + access_token } })
            const defaultRole = await UserRole.findOne({ where: { isDefault: true } })

            await Promise.all(users.map(async user => {
                const { empid, depcode, depid, companyid: CompanyId } = user
                const { data: { retdata: userData } } = await axios.get(base + '/api/hrms/hr/employee/get?EmployeeID=' + empid, { headers: { 'Authorization': 'Bearer ' + access_token } })
                const [foundUser, justCreated] = await User.findOrCreate({ where: { id: Number(empid) }, defaults: { firstname: user.firstname, firstname_enus: user.firstname_enus, mobilephone: user.mobilephone, details: { ...userData[0], ...user, totalwage: null, evolvewage: null, basewage: null, picturedata: null } } })
                await foundUser.setCompany(CompanyId)
                await foundUser.setUserRole(defaultRole.id)

                const hasUnit = await Unit.findOne({ where: { depcode, CompanyId } })
                if (hasUnit) await foundUser.setUnit(hasUnit.id)

                const hasSector = await Sector.findOne({ where: { depcode, CompanyId } })
                if (hasSector) await foundUser.setSector(hasSector.id)

                // const hasDepartment = await Department.findOne({ where: { id: depid, CompanyId } })
                const hasDepartment = await Department.findOne({ where: { depcode, CompanyId } })
                if (hasDepartment) await foundUser.setDepartment(hasDepartment.id)
            }))
            const userToSend = await User.findOne({ where: { id: Number(EmpID) } })
            resolve(userToSend)
        } catch (e) {
            reject(e)
        }
    })
}

exports.getStructuredData = async (req, res) => {
    try {
        const data = await Company.findAll({
            include: [
                {
                    model: Department,
                    include: [
                        {
                            model: Sector,
                            include: [
                                {
                                    model: Unit,
                                    include: [{
                                        model: User
                                    }]
                                },
                                {
                                    model: User
                                }
                            ]
                        },
                        {
                            model: User
                        }
                    ]
                }
            ],
            order: [['order', 'ASC']]
        })
        data.map((company, comInd) => {
            data[comInd].Departments = data[comInd].Departments.sort((a,b) => (a.name > b.name) ? 1 : -1)
            company.Departments.map((department, depInd) => {
                data[comInd].Departments[depInd].Sectors = data[comInd].Departments[depInd].Sectors.sort((a,b) => (a.name > b.name) ? 1 : -1);
                data[comInd].Departments[depInd].Users = data[comInd].Departments[depInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1);
                department.Sectors.map((sector, secInd) => {
                    data[comInd].Departments[depInd].Sectors[secInd].Units = data[comInd].Departments[depInd].Sectors[secInd].Units.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    data[comInd].Departments[depInd].Sectors[secInd].Users = data[comInd].Departments[depInd].Sectors[secInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    sector.Units.map((unit, unitInd) => {
                        data[comInd].Departments[depInd].Sectors[secInd].Units[unitInd].Users = data[comInd].Departments[depInd].Sectors[secInd].Units[unitInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    })
                })
            })
        })
        res.status(200).json(data)
    } catch (e) {
        console.log(e, 'getStructuredData')
        res.status(500).json({ error: e })
    }
}

exports.getStructuredDataFront = async (req, res) => {
    try {
        const data = await Company.findAll({
            include: [
                {
                    model: Department,
                    include: [
                        {
                            model: Sector,
                            include: [
                                {
                                    model: Unit,
                                    include: [{
                                        model: User
                                    }]
                                },
                                {
                                    model: User
                                }
                            ]
                        },
                        {
                            model: User
                        }
                    ],
                    where: { isShow: true }
                }
            ],
            order: [['order', 'ASC']],
            where: { isShow: true }
        })
        data.map((company, comInd) => {
            data[comInd].Departments = data[comInd].Departments.sort((a,b) => (a.name > b.name) ? 1 : -1)
            company.Departments.map((department, depInd) => {
                data[comInd].Departments[depInd].Sectors = data[comInd].Departments[depInd].Sectors.sort((a,b) => (a.name > b.name) ? 1 : -1);
                data[comInd].Departments[depInd].Users = data[comInd].Departments[depInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1);
                department.Sectors.map((sector, secInd) => {
                    data[comInd].Departments[depInd].Sectors[secInd].Units = data[comInd].Departments[depInd].Sectors[secInd].Units.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    data[comInd].Departments[depInd].Sectors[secInd].Users = data[comInd].Departments[depInd].Sectors[secInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    sector.Units.map((unit, unitInd) => {
                        data[comInd].Departments[depInd].Sectors[secInd].Units[unitInd].Users = data[comInd].Departments[depInd].Sectors[secInd].Units[unitInd].Users.sort((a,b) => (a.order > b.order) ? 1 : -1)
                    })
                })
            })
        })
        res.status(200).json(data)
    } catch (e) {
        console.log(e, 'getStructuredData')
        res.status(500).json({ error: e })
    }
}