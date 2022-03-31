const newstypeController = require("../controllers/newstype-controllers")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', newstypeController.count)
    router.get('/', newstypeController.find)
    router.post('/', newstypeController.create)
    router.get('/:id', newstypeController.findOne)
    router.put('/:id', newstypeController.update)
    router.delete('/:id', newstypeController.delete)

    return router
}