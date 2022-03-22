const newsController = require("../controllers/news-controllers")
const { adminAuth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', newsController.count)
    router.get('/', newsController.find)
    router.get('/:id', newsController.findOne)
    router.post('/', newsController.create)
    router.put('/:id', newsController.update)
    router.delete('/:id', newsController.delete)

    return router
}