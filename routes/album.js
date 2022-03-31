const albumController = require("../controllers/album-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', albumController.count)
    router.get('/', albumController.find)
    router.post('/', albumController.create)
    router.get('/:id', albumController.findOne)
    router.put('/:id', albumController.update)
    router.delete('/:id', albumController.delete)

    return router
}