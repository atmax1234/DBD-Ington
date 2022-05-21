const simplydjs = require("simply-djs")
const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'rps',
    description: 'Rock always wins',
    async execute(client, message, args){
    simplydjs.rps(message);
 }
}