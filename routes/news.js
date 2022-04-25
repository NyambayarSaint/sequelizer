const newsController = require("../controllers/news-controllers")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/type/:id', auth, newsController.getNews)
    router.get('/count', auth, newsController.count)
    router.get('/', newsController.find)
    router.post('/', auth, newsController.create)
    router.get('/:id', auth, newsController.findOne)
    router.put('/:id', auth, newsController.update)
    router.delete('/:id', auth, newsController.delete)

    return router
}