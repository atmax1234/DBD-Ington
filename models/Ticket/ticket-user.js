const { Schema, model } = require('mongoose');

const Tickets = new Schema({
    channel: String,
    guild: String,
    user: String,
})

module.exports = model("ticket-users", Tickets);