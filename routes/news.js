const newsController = require("../controllers/news-controllers")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', newsController.count)
    router.get('/', newsController.find)
    router.post('/', newsController.create)
    router.get('/:id', newsController.findOne)
    router.put('/:id', newsController.update)
    router.delete('/:id', newsController.delete)

    return router
}