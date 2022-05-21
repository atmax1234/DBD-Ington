const mongoose = require('mongoose')

let schema = new mongoose.Schema({
    GuildId: String,
    Role: Object,
})

module.exports = mongoose.model('captcha', schema)