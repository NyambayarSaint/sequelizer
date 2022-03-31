const userroleController = require('../controllers/userrole-controller')
const { auth } = require('../middleware/auth')

module.exports = (router) => {

    router.get('/', userroleController.getRoles)
    router.post('/', userroleController.addRole)
    router.get('/:id', userroleController.getRole)
    router.put('/:id', userroleController.updateRole)
    router.delete('/:id', userroleController.deleteRole)

    return router

}