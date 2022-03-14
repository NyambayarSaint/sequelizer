const sharp = require('sharp')
const { File } = require('../models')

exports.upload = async (req, res) => {
    try {
        const photos = req.files;
        if (!photos) throw 'No photos selected!'
        const uploadedPhotos = await Promise.all(photos.map(async photo => {
            return await File.create({
                name: photo.filename,
                ext: photo.mimetype,
                size: photo.size,
                url: photo.path,
                originalname: photo.originalname
            })
        }))

        // send response
        res.send({
            message: 'Photos are uploaded.',
            data: uploadedPhotos
        });
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

// exports.delete = async (req, res)