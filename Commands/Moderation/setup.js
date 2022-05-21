const { MessageEmbed } = require("discord.js")

module.exports = {
    name: "setup",
    aliases: "config",
    description: "Server Settings Configuration",
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADMINISTRATOR"],
    async execute(client, message, args){
        message.channel.send({
            embeds: [new MessageEmbed()
                .setTitle('**Server Settings**')
                .addFields(
                    { name: '**Set Welcome Channel**', value: '\`<prefix><set-welcome><#channel>\`', inline: false },
                    { name: '**Set Captcha Role**', value: '\`/setup-captcha <role>\`', inline: false },
                    { name: '**Set Prefix**', value: '\`<old-prefix><setprefix><new-prefix>\`', inline: false },
                    { name: '**Set Suggestion Channel**', value: '\`/suggestion channel <#channel>\`', inline: false },
                    { name: '**Set Moderation Logs Channel**', value: '\`<prefx><set-logs><#channel>\`', inline: false },
                )
            ],
        })
    }
}