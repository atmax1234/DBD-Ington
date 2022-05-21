const { Client, Message, MessageEmbed, Permissions } = require('discord.js');
const Schema = require('../../models/Mod-Logs/log-Schema')
module.exports = {
    name: 'set-logs',
    description: 'Set up the mog-logs',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send({
            content: 'You can\'t use this command!'
        });
        const channel = message.mentions.channels.first()

        if(!channel) return message.channel.send({
            content: 'Please mention a channel to set the logs!'
        });
        Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
            if(data) data.delete();
            new Schema({
                Guild: message.guild.id,
                Channel: channel.id,
            }).save();
            message.channel.send({
                embeds: [new MessageEmbed().setDescription(`<:Verified_Developer_Badge_SkyBlue:899282294685188139> ${channel} has been successfully set as modlogs!\nAll logs will be sent there`).setColor('GREEN')]
            })
        })
    }
}