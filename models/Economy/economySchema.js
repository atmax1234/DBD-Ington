const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    guildID: String,
    userID: String,
    createdAt: Number,
    wallet: Number,
    daily: Number,
}, {
    timestamps: true
})
module.exports = mongoose.model('economySchema', schema)