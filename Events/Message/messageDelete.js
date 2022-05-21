const { Collection, MessageEmbed } = require("discord.js");
const client = require("../../index");
const snipes = new Collection();
const logSchema = require('../../models/Mod-Logs/log-Schema')

module.exports = {
    name: 'messageDelete',
    async execute(message) {
        snipes.set(message.channel.id, message)
        const data = await logSchema.findOne({
            Guild: message.guild.id
        });
        if (!data) return;

        const channel = message.guild.channels.cache.get(data.Channel)

        const embed = new MessageEmbed()
            .setTitle('Message Deleted!')
            .setDescription(`Message deleted in <#${message.channel.id}> by **${message.author.tag}** \n> ${message.content}`)
            .setTimestamp()
            .setColor('GREEN')

        channel.send({
            embeds: [embed]
        });
    }
}
module.exports = snipes