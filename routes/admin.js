const adminController = require('../controllers/admin-controller')
const { auth } = require('../middleware/auth')

module.exports = (router) => {

    router.get('/initiate', adminController.initiateSettings)
    router.get('/endpoints', adminController.getEndpoints)
    router.get('/fetch', adminController.fetchEndpoints)

    router.get('/', adminController.getAdmins)
    router.get('/me', auth, adminController.me)
    router.post('/register', adminController.create)
    router.post('/signin', adminController.signin)
    router.get('/:id', adminController.getAdmin)
    router.delete('/:id', adminController.deleteAdmin)
    router.put('/:id', adminController.update)


    return router

}