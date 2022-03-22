const { File } = require("../models")
const { Op } = require('../models')

exports.updateHelper = (instance, params, skipArr = []) => {
    const updatedInstance = instance
    const keys = Object.keys(params)
    const itemsToSkip = skipArr
    itemsToSkip.push('createdAt', 'updatedAt', 'id');
    keys.forEach((key, index) => {
        if (!itemsToSkip.includes(key)) updatedInstance[key] = params[key]
    })
    return updatedInstance
}
exports.confirmImages = (arr = []) => {
    return new Promise((resolve, reject) => {
        Promise.all(arr.map(async id => {
            const instance = await File.findOne({ where: { id } })
            if (instance) return instance
        })).then(data => {
            resolve(data)
        }).catch(e => {
            reject(e)
        })
    })
}
exports.fillQueryParams = (queryParams) => {
    const { limit, offset, filters, sort } = queryParams

    const params = {}
    const operations = {}

    if (sort) {
        params.order = []
        const splittedSorts = sort.split(',')
        splittedSorts.map(splitted => {
            params.order.push(splitted.split(':'))
        })
    }
    if (limit) params.limit = limit
    if (offset) params.offset = offset
    if (filters) {
        const splitted = filters.split(',');
        splitted.map(splittedInstance => {
            const seperated = splittedInstance.split(':')
            operations[seperated[0]] = { [Op.like]: '%' + seperated[1] + '%' }
        })
    }
    return {
        params, operations
    }
}