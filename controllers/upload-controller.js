const sharp = require('sharp')
const { File, Admin, User } = require('../models')
const fs = require('fs')
const { Op } = require('../models')
const { imageMimetypes } = require('../utils/upload-config')

exports.upload = async (req, res) => {
    try {
        const images = req.files;
        if (!images || !images.length) throw 'No images selected!'
        const uploadedImages = await Promise.all(images.map(async image => {
            const fileBody = {
                name: image.filename,
                ext: image.mimetype,
                size: image.size,
                systemPath: image.path,
                url: '/uploads/' + image.filename,
                originalname: image.originalname,
                type: 'other',
                createdBy: req.user.id.toString()
            }
            if(imageMimetypes.includes(image.mimetype)) fileBody.type = 'image'
            return await File.create(fileBody)
        }))

        // send response
        res.send({
            message: 'Images are uploaded.',
            data: uploadedImages
        });
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

exports.edit = async (req, res) => {
    try{
        const { id, originalname } = req.body

        if(!id) throw 'No id specified!'
        const foundImage = await File.findOne({ where: { id } })
        if(!foundImage) throw 'No such image'
        foundImage.originalname = originalname
        await foundImage.save()
        res.status(200).json({ message: 'success' })
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.delete = async (req, res) => {
    try{
        const { images } = req.body
        if(!images.length) throw "No image id's"
        await Promise.all(images.map(async id => {
            const foundImage = await File.findOne({ where: { id } })
            if(!foundImage) throw 'No such image'
            fs.unlinkSync('public/'+foundImage.url)
            await foundImage.destroy()
        }))
        res.status(200).json({ message: 'Successfully deleted images' });
    } catch(e) {
        console.log('delete image catch', e)
        res.status(500).json({ error: e })
    }
}

exports.images = async (req, res) => {
    try{
        const { pagination, name } = req.body
        const search = {}
        let user = { createdBy: req.user.id.toString() }

        if(name) search.originalname = { [Op.like]: '%' + name + '%' }
        if(req.type === "admin") if(req.user.AdminRole.isSuper) user = {}
        const images = await File.findAll({
            ...pagination,
            order: [ ['updatedAt', 'DESC'] ],
            where: {
                ...search,
                ...user
            }
        });
        res.status(200).json(images)
    } catch(e){
        console.log('images get??', e)
        res.status(500).json({ error: e })
    }
}