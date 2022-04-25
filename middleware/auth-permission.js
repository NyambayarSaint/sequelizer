const { Admin } = require('../models')

module.exports = (actionKey) => {
    return async (req, res, next) => {
        try {
            const instance = req.user
            let permissions = req.type === "admin" ? instance.AdminRole.Permissions : instance.UserRole.Permissions
            let hasAccess = false
            permissions.forEach(perm => {if(perm.key === actionKey) hasAccess = true})
            if(hasAccess) next()
            else throw 'You dont have permission'
        } catch (e) {
            console.log(e, 'error')
            res.status(401).json(e)
        }
    }
}