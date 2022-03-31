const uploadControllers = require('../controllers/upload-controller')
const multer = require('multer')
const { auth } = require('../middleware/auth')
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
        
        router.post('/', auth, multer({ storage }).array('images'), uploadControllers.upload)
        router.post('/edit', auth, uploadControllers.edit)
        router.post('/images', auth, uploadControllers.images)
        router.post('/delete', auth, uploadControllers.delete)

        return router

    }