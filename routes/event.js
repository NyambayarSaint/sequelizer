const eventController = require('../controllers/event-controller')
const { auth } = require("../middleware/auth")
const { allowedPermissions } = require('../utils/admin-permissions')
const authPermission = require('../middleware/auth-permission')

module.exports = (router) => {

    router.get('/count', auth, authPermission('event./count.count'), eventController.count)
    router.get('/birthdays', auth, authPermission('event./birthdays.findWithBirthdays'), eventController.findWithBirthdays)
    router.get('/', auth, authPermission('event./.find'), eventController.find)
    router.post('/', auth, authPermission('event./.create'), eventController.create)
    router.get('/:id', auth, authPermission('event./:id.findOne'), eventController.findOne)
    router.put('/:id', auth, authPermission('event./:id.update'), eventController.update)
    router.delete('/:id', auth, authPermission('event./:id.delete'), eventController.delete)

    allowedPermissions.push({
        endpoint: '/event',
        name: 'event',
        permissions: [
            { method: 'GET', key: 'event./count.count' },
            { method: 'GET', key: 'event./birthdays.findWithBirthdays' },
            { method: 'GET', key: 'event./.find' },
            { method: 'POST', key: 'event./.create' },
            { method: 'GET', key: 'event./:id.findOne' },
            { method: 'PUT', key: 'event./:id.update' },
            { method: 'DELETE', key: 'event./:id.delete' },
        ]
    });

    return router
}