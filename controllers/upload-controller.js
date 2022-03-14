const sharp = require('sharp')
const { File } = require('../models')
const fs = require('fs')
const { Op } = require('../models')

exports.upload = async (req, res) => {
    try {
        const images = req.files;
        if (!images) throw 'No images selected!'
        const uploadedImages = await Promise.all(images.map(async image => {
            return await File.create({
                name: image.filename,
                ext: image.mimetype,
                size: image.size,
                systemPath: image.path,
                url: '/uploads/' + image.filename,
                originalname: image.originalname,
                type: 'image'
            })
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

exports.delete = async (req, res) => {
    try{
        const { images } = req.body
        if(!images.length) throw "No image id's"
        await Promise.all(images.map(async id => {
            const foundImage = await File.findOne({ where: { id } })
            if(!foundImage) throw 'No such image'
            fs.unlinkSync(foundImage.url)
            await foundImage.destroy()
        }))
        res.status(200).json({ message: 'Successfully deleted images' });
    } catch(e) {
        res.status(500).json({ error: e })
    }
}

exports.images = async (req, res) => {
    try{
        const { pagination } = req.body
        let { name } = req.body
        if(!name) name = '';
        let images = []
        if(name) {
            images = await File.findAll({ ...pagination, where: { type: 'image', originalname: { [Op.like]: '%' + name + '%' } } });
        } else {
            images = await File.findAll({ ...pagination, where: { type: 'image' } });
        }
        res.status(200).json({ data: images })
    } catch(e){
        res.status(500).json({ error: e })
    }
}