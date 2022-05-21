const { Client, Message, MessageEmbed } = require('discord.js');
const fights = require('../../data/fights.json');

module.exports = {
    name: 'fight',
    description: 'Fights a user',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
        const user = message.mentions.users.first();
        if(!user) return message.reply('You can\'t fight with a thin air, pick someone fool..')
        const reason = args.splice(1).join(' ') || 'Just for Fun!'
        if(user.id === "838501692743221248") return message.reply('You can\'t win against him, he will kill u :wink:')
        const fightembed = new MessageEmbed()
        .setColor('FUCHSIA')
        .setDescription(`Our Fighters: ||${message.author.username}|| is fighting vs ||${user.username}||\n\n**Reason:** \`${reason}\`
        \n**The result:** ||${fights[Math.floor(Math.random() * fights.length)]}||`)
        message.channel.send({
            embeds: [fightembed]
        })
    }
}