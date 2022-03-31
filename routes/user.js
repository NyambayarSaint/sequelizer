const userController = require('../controllers/user-controller')
const { auth } = require('../middleware/auth')

module.exports = (router) => {

    router.get('/count', userController.count)
    router.get('/', userController.find)
    router.get('/me', auth, userController.me)
    router.post('/create', userController.create)
    router.post('/signin', userController.signin)
    router.get('/:id', userController.findOne)
    router.delete('/:id', userController.delete)
    router.put('/:id', userController.update)


    return router

}