const uploadControllers = require('../controllers/upload-controller')
const multer = require('multer')
// const multerUpload = multer({ dest: 'public/uploads' })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' +file.originalname)
    }
})

    module.exports = (router) => {

        router.post('/', multer({ storage }).array('images'), uploadControllers.upload)
        router.post('/images', uploadControllers.images)
        router.post('/delete', uploadControllers.delete)

        return router

    }