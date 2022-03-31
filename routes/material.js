const materialController = require("../controllers/material-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', materialController.count)
    router.get('/', materialController.find)
    router.post('/', materialController.create)
    router.get('/:id', materialController.findOne)
    router.put('/:id', materialController.update)
    router.delete('/:id', materialController.delete)

    return router
}