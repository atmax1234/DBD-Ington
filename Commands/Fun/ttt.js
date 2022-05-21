const simplydjs = require("simply-djs")
const { Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ttt',
    description: 'tictactoe',
    async execute(client, message, args){
    simplydjs.tictactoe(message, {
        credit: false
    });
 }
}