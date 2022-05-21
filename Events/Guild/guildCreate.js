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
                        { name: '📜 **To get list of my commands:**', value: '/help (Type: slashCommand)', inline: true },
                        { name: '🧑‍💻 **My Developer:**', value: 'She Got Da Swagger#7777 >> 838501692743221248', inline: true },
                        { name: '❗ **My prefix:**', value: '__s!__ but you can customize it to anything you want using \`s!setprefix <new prefix>\`', inline: false },
                        { name: '🔴 **IMPORTANT:**', value: 'Please before using me make sure to set up my commands!', inline: true },
                        { name: '\u200B❓ **How to set up my commands? It\'s easy:**', value: '\`<prefix>setup\`', inline: false },
                    )
                    .setFooter({
                        text: 'Thank you for inviting me! 😎',
                    })
            ]
        })
    }
}