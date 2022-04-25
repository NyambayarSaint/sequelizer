const feedbackController = require("../controllers/feedback-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', feedbackController.count)
    router.get('/', feedbackController.find)
    router.post('/', feedbackController.create)
    router.get('/:id', feedbackController.findOne)
    router.put('/:id', feedbackController.update)
    router.delete('/:id', feedbackController.delete)

    return router
}