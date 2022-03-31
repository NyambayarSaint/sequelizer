const { AdminRole, Permission } = require('../models')
const { sequelize } = require('../models')

// ROLES API
exports.getRole = async (req, res) => {
    const {id} = req.params
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
    const {name, permissions, description} = req.body
    const { id } = req.params
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
    const { id } = req.params
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