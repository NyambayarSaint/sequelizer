const adminController = require('../controllers/adminrole-controller')
const { auth } = require('../middleware/auth')

module.exports = (router) => {

    router.get('/', adminController.getRoles)
    router.post('/', adminController.addRole)
    router.get('/:id', adminController.getRole)
    router.put('/:id', adminController.updateRole)
    router.delete('/:id', adminController.deleteRole)

    return router

}