const postController = require("../controllers/post-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', postController.count)
    router.get('/my', auth, postController.my)
    router.get('/', postController.find)
    router.post('/', postController.create)
    router.get('/:id', postController.findOne)
    router.put('/:id', postController.update)
    router.delete('/:id', postController.delete)

    return router
}