const { Admin, AdminRole, Permission, Endpoint } = require('../models')
const { sequelize } = require('../models')
const { allowedPermissions } = require('../utils/admin-permissions')
const bcrypt = require('bcryptjs');

exports.initiateSettings = async (req, res) => {
    try {
        Promise.all(allowedPermissions.map(async ({ name, endpoint, permissions }) => {
            
            let thisEndpoint
            const endpointAlreadyExist = await Endpoint.findOne({ where: { name, endpoint } })

            if(endpointAlreadyExist) thisEndpoint = endpointAlreadyExist
            else thisEndpoint = await Endpoint.create({ name, endpoint }).catch(err => { throw new Error(err) })
                
            await Promise.all(permissions.map(async (permissionInstance, i) => {
                const permissionAlreadyExist = await Permission.findOne({ where: { key: permissionInstance.key } })
                if(permissionAlreadyExist) console.log(permissionAlreadyExist.key, 'permission already exists')
                else {
                    const createdPermission = await Permission.create(permissionInstance).catch(err => { throw new Error(err) })
                    await thisEndpoint.addPermission(createdPermission)
                }
            }))
        })).then(async () => {
            console.log('Permissions filled up successfully!')
            const superadmin = 'superadmin'
            const alreadyExist = await AdminRole.findOne({ where: { name: superadmin } })
            if(alreadyExist) throw superadmin + ' already exists!'
            const createdRole = await AdminRole.create({ name: superadmin, isDefault: false, isSuper: true, description: 'A super privileged admin who has access to everything' })
            const allPermissions = await Permission.findAll()
            await createdRole.addPermissions(allPermissions)
            return createdRole
        }).then(async (role) => {
            console.log('Super admin has gained all permissions!')
            const adminuser = 'nymsak'
            const alreadyExist = await Admin.findOne({ where: { username: adminuser } })
            if(alreadyExist) throw adminuser + ' (superadmin) already exists!'
            const createdAdmin = await Admin.create({ username: adminuser, password: '123456', description: 'My super user' })
            await createdAdmin.setAdminRole(role)
            console.log(adminuser + ' has gained access superadmin');
        }).then(async () => {
            const defaultRole = 'editor'
            const alreadyExist = await AdminRole.findOne({ where: { name: defaultRole } })
            if(alreadyExist) throw defaultRole + ' role already exists!'
            await AdminRole.create({ name: defaultRole, isDefault: true, description: 'A typical editor role' })
            console.log(`Default role (${defaultRole}) added successfully!`);
            return res.status(201).json({ message: 'All done!' })
        }).catch(err => {
            console.log('Settings initation failed - ', err)
            return res.status(500).json({ error: err })
        })
    } catch(e) {
        console.log('initiateSettings catch', e)
        return res.status(500).json({ error: e })
    }
}

exports.register = async (req, res) => {
    try {
        const { username, password, description, roleId } = req.body
        const adminAlreadyExists = await Admin.findOne({ where: { username } })
        if (adminAlreadyExists) throw 'Admin with username already exists'
        const foundRole = await AdminRole.findOne({ where: { id: roleId } })
        if(!foundRole) throw 'no such role!'
        const savedAdmin = await Admin.create({ username, password, description })
        if(!savedAdmin) throw 'Failed to create admin'
        await savedAdmin.setAdminRole(foundRole)
        const token = await savedAdmin.generateAuthToken()
        return res.json({ jwt: token });
    } catch(e) {
        console.log('register error catch - ', e)
        return res.status(500).json({ error: e })
    }
}
exports.signin = async (req, res) => {
    const {username, password} = req.body
    try{
        const admin = await Admin.findByCredentials(username, password);
        const token = await admin.generateAuthToken();
        return res.status(200).json({jwt: token});
    } catch(e) {
        console.log('sign in catch', e)
        res.status(401).json({error: e})
    }
}
exports.updateAdmin = async (req, res) => {
    const { id, username, description, password, roleId } = req.body
    try{
        const foundAdmin = await Admin.findOne({ where: { id } })
        if(!foundAdmin) throw 'no such admin!'
        if(foundAdmin.username !== username) {
            const adminWithSameUsername = await Admin.findOne({ where: { username } })
            if(adminWithSameUsername) throw 'Theres an admin that has same username!'
            foundAdmin.username = username
            await foundAdmin.save()
        }
        if(foundAdmin.description !== description) {
            foundAdmin.description = description
            await foundAdmin.save()
        }
        console.log(foundAdmin, 'foundAdmin!')
        if(foundAdmin.AdminRoleId !== roleId){
            console.log('role change trigger??');
            const foundRole = await AdminRole.findOne({ where: { id: roleId } })
            if(!foundRole) throw 'no such role!'
            await foundAdmin.setAdminRole(foundRole)
        }
        if(password){
            foundAdmin.password = await bcrypt.hash(password, 8)
            await foundAdmin.save()
        }
        res.status(200).json({ message: 'success' })
    } catch(e) {
        console.log('updateAdmin catch', e)
        res.status(500).json({ error: e })
    }
}
exports.deleteAdmin = async (req, res) => {
    const { id } = req.body
    try{
        const foundAdmin = await Admin.findOne({ where: { id } })
        if(!foundAdmin) throw 'no such admin!'
        await foundAdmin.destroy()
        res.status(200).json({ message: 'success' })
    } catch(e) {
        res.status(500).json({ error: e })
    }
}
exports.getAdmin = async (req, res) => {
    const { id } = req.body
    try{
        const admin = await Admin.findOne({ where: { id } })
        res.status(200).json(admin)
    } catch(e) {
        console.log('getAdmin catch', e)
        res.status(400).json({error: e})
    }
}
exports.me = async (req, res) => {
    const userDetail = await Admin.findOne({where: { id: req.user.id }, include: [{ model: AdminRole, include: [Permission] }]})
    return res.status(200).json({ user: userDetail });
}
exports.getAdmins = async (req, res) => {
    try{
        const admins = await Admin.findAll({ include: AdminRole })
        res.status(200).json(admins)
    } catch(e){
        res.status(500).json({ error: e })
    }
}

// ROLES API
exports.getRole = async (req, res) => {
    const {id} = req.body
    try{
        const role = await AdminRole.findOne({where: { id }, include: Permission})
        if(!role) throw 'No such role!'
        res.status(200).json(role)
    } catch(e) {
        console.log('getRole catch', e)
        res.status(500).json({error: e})
    }
}
exports.getRoles = async (req, res) => {
    try{
        const roles = await AdminRole.findAll()
        return res.status(200).json([... roles])
    } catch(e){
        console.log('getRoles catch', e)
        return res.status(500).json({error: e})
    }
}
exports.addRole = async (req, res) => {
    const {name, description, permissions} = req.body
    const transaction = await sequelize.transaction()
    try{
        const createdRole = await AdminRole.create({ name, description }, { transaction });
        await Promise.all(permissions.map(async instance => {
            const foundPermission = await Permission.findOne({ where: { key: instance.key, method: instance.method } })
            if(!foundPermission) throw 'No such permission';
            createdRole.addPermission(foundPermission)
        }))
        await transaction.commit()
        res.status(201).json({})
    } catch(e) {
        transaction.rollback()
        console.error('addRole catch', e)
        return res.status(500).json({ error: e })
    }
}
exports.updateRole = async (req ,res) => {
    const {name, permissions, id, description} = req.body
    try {
        const checkedRole = await AdminRole.findOne({ where: { id } })
        if(!checkedRole) throw 'No such role!'
        await checkedRole.setPermissions([])
        await Promise.all(permissions.map(async instance => {
            const foundPermission = await Permission.findOne({ where: { key: instance.key, method: instance.method } })
            if(!foundPermission) throw 'Roles does not match!';
            await checkedRole.addPermission(foundPermission)
        }));
        checkedRole.name = name
        checkedRole.description = description
        await checkedRole.save()
        const result = await checkedRole.getPermissions()
        res.status(200).json({ message: 'Success!', data: result })
    } catch(e) {
        console.log('updateRole catch', e)
        return res.status(500).json({ error: e })
    }
}
exports.deleteRole = async (req, res) => {
    const { id } = req.body
    try {
        const checkedRole = await AdminRole.findOne({ where: { id: id } })
        if(!checkedRole) throw 'No such role!'
        const associatedAdmins =  await checkedRole.getAdmins()
        if(associatedAdmins.length) throw 'You must first delete admin users associated with this role!'
        console.log(associatedAdmins, 'associatedAdmins')
        if(checkedRole.name === 'superadmin') throw "Unable to delete the 'superadmin'"
        await checkedRole.destroy()
        return res.status(200).json({ message: 'Role deleted successfully' });
    } catch(e) {
        console.log('deleteRole catch', e)
        return res.status(500).json({ error: e })
    }
}
exports.getEndpoints = async (req, res) => {
    try{
        const result = await Endpoint.findAll({ include: Permission })
        return res.status(200).json(result)
    } catch(e) {
        console.log('getEndpoints catch', e)
        return res.status(500).json({ error: e })
    }
}