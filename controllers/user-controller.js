const { User } = require('../models')
const { UserRole } = require('../models')
const CTS = process.env.CTS
const CTE = process.env.CTE

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (e) {
        console.log('error get users', e)
    }
}

exports.me = async (req, res) => {
    res.status(200).json({ message: 'welcome!' })
}

exports.signin = async (req, res) => {
    const {username, password} = req.body
    try{
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        res.cookie('Authorization', `${CTS}${token}${CTE}`)
        res.status(200).json({message: 'logged in'});
    } catch(e) {
        console.log('sign in catch', e)
        res.status(400).json({message: 'fail'})
    }
}

exports.register = async (req, res) => {

    try {
        const { username, password } = req.body
        const userAlreadyExists = await User.findOne({ where: { username } })
        if (userAlreadyExists) throw new Error('User with username already exists')
        const defaultRole = await UserRole.findOne({ where: { isDefault: true } })
        const savedUser = await User.create({ username, password: password })
        await savedUser.addUserRole(defaultRole)
        if (savedUser) res.json({ message: "Thanks for registering" });
    } catch(e) {
        console.log('register error catch - ', e)
        return res.status(500).json({ message: 'fail' })
    }
}

exports.update = async (req, res) => {
    console.log('params!!!', req.params);
    const { id } = req.params
}