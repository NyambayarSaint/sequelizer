const PostsController = require('../controllers/posts-controller')
const { allowedPermissions } = require('../utils/admin-permissions')
const userPermissionAuth = require('../middleware/user-permissions-auth')
const { auth } = require('../middleware/auth')

module.exports = (router) => {

    router.get("/", auth, userPermissionAuth('posts./.get'), PostsController.get)
    router.post("/", PostsController.post) // posts./.post

    allowedPermissions.push({
        endpoint: '/posts',
        name: 'posts',
        permissions: [
            { method: 'GET', key: 'posts./.get' },
            { method: 'POST', key: 'posts./.post' },
        ]
    });

    return router;
};