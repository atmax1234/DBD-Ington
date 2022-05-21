const { Schema, model } = require('mongoose');

const Tickets = new Schema({
    guild: String,
    index: { type: Number, default: 0 },
    message: {
        type: String,
        default: 0
    },
})

module.exports = model("ticket-panels", Tickets);