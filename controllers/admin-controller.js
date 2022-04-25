const { Admin, AdminRole, Permission, Endpoint, File, Department, Company, UserRole } = require('../models')
const { allowedPermissions } = require('../utils/admin-permissions')
const bcrypt = require('bcryptjs');
const { updateHelper } = require('../utils/micro-functions');

exports.getEndpoints = async (req, res) => {
    try {
        const result = await Endpoint.findAll({ include: Permission })
        return res.status(200).json(result)
    } catch (e) {
        console.log('getEndpoints catch', e)
        return res.status(500).json({ error: e })
    }
}

exports.fetchEndpoints = async (req, res) => {
    try {
        allowedPermissions.map(async instance => {
            let parent
            const parentFound = await Endpoint.findOne({ where: { name: instance.name, endpoint: instance.endpoint } })
            if (parentFound) parent = parentFound
            else parent = await Endpoint.create({ name: instance.name, endpoint: instance.endpoint })
            await Promise.all(instance.permissions.map(async permInstance => {
                let child
                const childFound = await Permission.findOne({ where: { key: permInstance.key, method: permInstance.method } }).catch(err => console.log(err, 'findOne error'))
                if (childFound) child = childFound
                else {
                    child = await Permission.create({ key: permInstance.key, method: permInstance.method }).catch(err => console.log(err, 'create error'))
                }
                await child.setEndpoint(parent.id).catch(err => console.log(err, 'set error'))
            }))
            res.status(200).json({ message: 'Successfully fetched endpoints' })
        })
    } catch (e) {
        console.log(e, 'fetchEndpoints failed')
        res.status(500).json({ error: e })
    }
}

exports.initiateSettings = async (req, res) => {
    try {
        Promise.all(allowedPermissions.map(async ({ name, endpoint, permissions }) => {

            let thisEndpoint
            const endpointAlreadyExist = await Endpoint.findOne({ where: { name, endpoint } })

            if (endpointAlreadyExist) thisEndpoint = endpointAlreadyExist
            else thisEndpoint = await Endpoint.create({ name, endpoint }).catch(err => { throw new Error(err) })

            await Promise.all(permissions.map(async (permissionInstance, i) => {
                const permissionAlreadyExist = await Permission.findOne({ where: { key: permissionInstance.key } })
                if (permissionAlreadyExist) console.log(permissionAlreadyExist.key, 'permission already exists')
                else {
                    const createdPermission = await Permission.create(permissionInstance).catch(err => { throw new Error(err) })
                    await thisEndpoint.addPermission(createdPermission)
                }
            }))
        })).then(async () => {
            console.log('Permissions filled up successfully!')
            const superadmin = 'superadmin'
            const alreadyExist = await AdminRole.findOne({ where: { name: superadmin } })
            if (alreadyExist) return alreadyExist
            const createdRole = await AdminRole.create({ name: superadmin, isDefault: false, isSuper: true, description: 'A super privileged admin who has access to everything' })
            const allPermissions = await Permission.findAll()
            await createdRole.addPermissions(allPermissions)
            return createdRole
        }).then(async (role) => {
            console.log('Super admin has gained all permissions!')
            const adminuser = 'nymsak'
            const alreadyExist = await Admin.findOne({ where: { username: adminuser } })
            if (alreadyExist) throw adminuser + ' (superadmin) already exists!'
            const createdAdmin = await Admin.create({ username: adminuser, password: '123456', description: 'My super user' })
            await createdAdmin.setAdminRole(role)
            console.log(adminuser + ' has gained access superadmin');
        }).then(async () => {
            const defaultRole = 'editor'
            const alreadyExist = await AdminRole.findOne({ where: { name: defaultRole } })
            if (alreadyExist) throw defaultRole + ' role already exists!'
            await AdminRole.create({ name: defaultRole, isDefault: true, description: 'A typical editor role' })
            console.log(`Default role (${defaultRole}) added successfully!`);
            const userRoleCreated = UserRole.create({ name: 'authenticated', description: 'default authenticated role', isDefault: true })
            return res.status(201).json({ message: 'All done!' })
        }).catch(err => {
            console.log('Settings initiation failed - ', err)
            return res.status(500).json({ error: err })
        })
    } catch (e) {
        console.log('initiateSettings catch', e)
        return res.status(500).json({ error: e })
    }
}
exports.signin = async (req, res) => {
    const { username, password } = req.body
    try {
        const admin = await Admin.findByCredentials(username, password);
        const token = await admin.generateAuthToken();
        return res.status(200).json({ jwt: token });
    } catch (e) {
        console.log('sign in catch', e)
        res.status(401).json({ error: e })
    }
}
exports.create = async (req, res) => {
    try{
        const params = { ...req.body }
        const createdInstance = await Admin.create(params)

        //relation settings
        if(params.DepartmentId) {
            const foundDepartment = Department.findOne({ where: { id: params.DepartmentId } })
            createdInstance.setCompany(foundDepartment.CompanyId)
        }

        res.status(200).json(createdInstance)
    } catch(e) {
        console.log('create Admin catch - ', e)
        res.status(500).json({ error: e })
    }
}

exports.update = async (req, res) => {
    try{
        const params = { ...req.body }
        const { id } = req.params

        const foundInstance = await Admin.findOne({ where: { id } })
        if(!foundInstance) throw 'no such Admin'

        const updatedInstance = updateHelper(foundInstance, params, ['password'])
        if(params.password) foundInstance.password = await bcrypt.hash(password, 8)
        await updatedInstance.save()

        //relation settings
        
        res.status(200).json({ message: 'success' })
    } catch(e){
        console.log(e, 'update Admin catch')
        res.status(500).json({ error: e })
    }
}
exports.deleteAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const foundAdmin = await Admin.findOne({ where: { id } })
        if (!foundAdmin) throw 'no such admin!'
        await foundAdmin.destroy()
        res.status(200).json({ message: 'success' })
    } catch (e) {
        res.status(500).json({ error: e })
    }
}
exports.getAdmin = async (req, res) => {
    const { id } = req.params
    try {
        const admin = await Admin.findOne({
            where: { id },
            include: [
                { model: AdminRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })
        res.status(200).json(admin)
    } catch (e) {
        console.log('getAdmin catch', e)
        res.status(400).json({ error: e })
    }
}
exports.me = async (req, res) => {
    try {
        const userDetail = await Admin.findOne({
            where: { id: req.user.id },
            include: [
                { model: AdminRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })
        return res.status(200).json({ user: userDetail });
    } catch (e) {
        res.status(500).json({ error: e })
    }
}
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            include: [
                { model: AdminRole, include: [Permission] },
                { model: Department, include: [Company] },
                { model: Company },
                { model: File }
            ]
        })
        res.status(200).json(admins)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}