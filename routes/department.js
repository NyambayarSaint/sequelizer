const departmentController = require("../controllers/department-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', departmentController.count)
    router.get('/', departmentController.find)
    router.post('/', departmentController.create)
    router.get('/:id', departmentController.findOne)
    router.put('/:id', departmentController.update)
    router.delete('/:id', departmentController.delete)

    return router
}