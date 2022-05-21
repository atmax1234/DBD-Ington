const { model, Schema } = require('mongoose')

let data = new Schema({
    prefix: String,
    guild: String
})

module.exports = model('prefix-schemas', data);