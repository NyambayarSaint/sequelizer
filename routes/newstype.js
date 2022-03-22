const newstypeController = require("../controllers/newstype-controllers")
const { adminAuth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', newstypeController.count)
    router.get('/', newstypeController.find)
    router.get('/:id', newstypeController.findOne)
    router.post('/', newstypeController.create)
    router.put('/:id', newstypeController.update)
    router.delete('/:id', newstypeController.delete)

    return router
}