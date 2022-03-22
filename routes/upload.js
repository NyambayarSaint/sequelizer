const uploadControllers = require('../controllers/upload-controller')
const multer = require('multer')
const { adminAuth } = require('../middleware/auth')
// const multerUpload = multer({ dest: 'public/uploads' })

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file, 'fillleee?')
        cb(null, Date.now() + '_' +file.originalname)
    }
})

    module.exports = (router) => {

        router.post('/', adminAuth, multer({ storage }).array('images'), uploadControllers.upload)
        router.post('/edit', adminAuth, uploadControllers.edit)
        router.post('/images', adminAuth, uploadControllers.images)
        router.post('/delete', adminAuth, uploadControllers.delete)

        return router

    }