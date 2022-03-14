const adminController = require('../controllers/admin-controller')
const { adminAuth } = require('../middleware/auth')

module.exports = (router) => {

    router.get('/initiate', adminController.initiateSettings)

    router.get('/me', adminAuth, adminController.me)
    router.get('/get-admins', adminController.getAdmins)
    router.post('/get-admin', adminController.getAdmin)
    router.post('/register', adminController.register)
    router.post('/signin', adminController.signin)
    router.post('/delete-admin', adminController.deleteAdmin)
    router.put('/updateAdmin', adminController.updateAdmin)

    router.get('/roles', adminController.getRoles)
    router.post('/roles/me', adminController.getRole)
    router.post('/roles', adminController.addRole)
    router.put('/roles', adminController.updateRole)
    router.post('/roles/delete', adminController.deleteRole)

    router.get('/endpoints', adminController.getEndpoints)

    return router

}