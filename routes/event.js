const eventController = require('../controllers/event-controller')
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', eventController.count)
    router.get('/', eventController.find)
    router.post('/', eventController.create)
    router.get('/:id', eventController.findOne)
    router.put('/:id', eventController.update)
    router.delete('/:id', eventController.delete)

    return router
}