const folderController = require("../controllers/folder-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', auth, folderController.count)
    router.get('/type/:id', auth, folderController.getFolders)
    router.get('/', auth, folderController.find)
    router.post('/', auth, folderController.create)
    router.get('/:id', auth, folderController.findOne)
    router.put('/:id', auth, folderController.update)
    router.delete('/:id', auth, folderController.delete)

    return router
}