const { MessageEmbed } = require("discord.js")
const logSchema = require('../../models/Mod-Logs/log-Schema')
const client = require("../../index")

module.exports = {
    name: 'guildBanRemove',
    async execute(guild, user) {
        const data = await logSchema.findOne({
            Guild: guild.id
        });
        if (!data) return console.log('guildBanRemove event returned no data');

        const channel = guild.channels.cache.get(data.Channel)

        const embed = new MessageEmbed()
            .setTitle('Time is up!')
            .setDescription(`\`(${user.id}) ${user.username}\` temporary ban has been lifted`)
            .setTimestamp()
            .setColor('GREEN')
        channel.send({
            embeds: [embed]
        });
    }
}