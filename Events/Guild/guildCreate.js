const { MessageEmbed } = require("discord.js")
const client = require("../../index")

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        const inviter = (await guild.fetchAuditLogs({ type: "BOT_ADD" })).entries.filter(u => u.target.id == client.user.id).first().executor

        inviter.send({
            embeds: [
                new MessageEmbed()
                    .setColor("RANDOM")
                    .setTimestamp()
                    .setAuthor({
                        name: guild.name,
                        iconURL: guild?.iconURL({ dynamic: true })
                    })
                    .setDescription(`Hello <@${inviter.id}>, thank you for inviting me to **${guild.name}** !`)
                    .addFields(
                        { name: 'ð **To get list of my commands:**', value: '/help (Type: slashCommand)', inline: true },
                        { name: 'ð§âð» **My Developer:**', value: 'She Got Da Swagger#7777 >> 838501692743221248', inline: true },
                        { name: 'â **My prefix:**', value: '__s!__ but you can customize it to anything you want using \`s!setprefix <new prefix>\`', inline: false },
                        { name: 'ð´ **IMPORTANT:**', value: 'Please before using me make sure to set up my commands!', inline: true },
                        { name: '\u200Bâ **How to set up my commands? It\'s easy:**', value: '\`<prefix>setup\`', inline: false },
                    )
                    .setFooter({
                        text: 'Thank you for inviting me! ð',
                    })
            ]
        })
    }
}