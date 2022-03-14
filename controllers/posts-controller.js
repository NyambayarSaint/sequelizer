const { Post } = require('../models')

exports.get = async (req, res) => {

    try{
        const PostsResult = await Post.findAll()
        return res.status(200).json(PostsResult)
    } catch(e) {
        console.log('Error - Posts.findAll', e)
        return res.status(400)
    }
}

exports.post = async (req, res) => {

    try{
        const newPost = await Post.create({ ...req.body })
        return res.status(200).json(newPost)
    } catch(e) {
        console.log('Error - Posts.create', e)
        return res.status(400)
    }

}