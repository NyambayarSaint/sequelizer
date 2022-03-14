const { Admin } = require('../models')

module.exports = (actionKey) => {
    return async (req, res, next) => {
        const [model, path, method] = actionKey.split('.');
        console.log(model, path, method, 'yeeey')
        try{
            next()
        } catch(e) {

        }
    }
}