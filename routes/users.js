const userController = require('../controllers/user-controller')
const { userAuth } = require('../middleware/auth')

module.exports = (router) => {
    
    router.get("/", userController.getAllUsers)
    router.get("/me", userAuth, userController.me)
    router.put("/:id", userController.update)
    router.post("/register", userController.register)
    router.post("/signin", userController.signin)

    return router;
    
};
