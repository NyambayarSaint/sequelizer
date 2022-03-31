const jobpostingController = require("../controllers/jobposting-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', jobpostingController.count)
    router.get('/', jobpostingController.find)
    router.post('/', jobpostingController.create)
    router.get('/:id', jobpostingController.findOne)
    router.put('/:id', jobpostingController.update)
    router.delete('/:id', jobpostingController.delete)

    return router
}