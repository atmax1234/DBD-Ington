const { model, Schema } = require('mongoose')

let data = new Schema({
    channel: String,
    guild: String
})

module.exports = model('welcome', data);