const companyController = require("../controllers/company-controller")
const { auth } = require("../middleware/auth")

module.exports = (router) => {

    router.get('/count', companyController.count)
    router.post('/init', companyController.init)
    router.post('/getstructuredata', companyController.getStructuredDataFront)
    router.post('/getstructure', companyController.getStructuredData)
    router.get('/', companyController.find)
    router.post('/', companyController.create)
    router.get('/:id', companyController.findOne)
    router.put('/:id', companyController.update)
    router.delete('/:id', companyController.delete)

    return router
}