const {
    getTarget,
    getGuild,
    getMessageAuthor,
    MessageSend,
    reply,
} = require('../../data/functions/ImportantFunctions')
const {MessageEmbed} = require('discord.js')
module.exports = {
    name:'test',
    description: 'Reload your new command',
    async execute(client, message, args){
        let target = getTarget(args[0], message)
        let guild = getGuild('907643166386167830')
        MessageSend({
            embeds: [
                new MessageEmbed()
                .setAuthor({
                    name: getMessageAuthor(message).tag
                })
                .setColor('AQUA')
                .setTitle('Testing My Functions')
                .setDescription(`Target: ${target} | Guild: ${guild} | Author: ${getMessageAuthor(message).tag}`)
            ]
        }, message)
        reply('Reply-a baca perfe', message)
    }
}