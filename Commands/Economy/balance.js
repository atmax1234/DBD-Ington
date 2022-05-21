const { Client, Message, MessageEmbed } = require('discord.js');
const economySchema = require("../../models/Economy/economySchema");
require('mongoose')
module.exports = {
    name: 'balance',
    description: 'Check your/another person\'s balance',
    aliases: ["wallet"],
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const titleEmoji = "<:uber_rich:939923834608435220>";
        const descriptionEmoji = "<:Gold_Coin:939923358877896764>";
        const userid = message.mentions.users.first() || message.author
        let balanceProfile = await economySchema.findOne({ userID: userid.id })
        if (balanceProfile) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({
                            name: `${userid.username}`,
                            iconURL: userid.avatarURL({
                                dynamic: true
                            })
                        })
                        .setFooter({
                            text: `Developed by aTmAx ©`
                        })
                        .setTitle(`${userid.username}'s Balance ${titleEmoji}`)
                        .setDescription(`${userid.id == message.author.id ? `Your Balance: ${balanceProfile.wallet}${descriptionEmoji}` : `${userid.username}'s Balance: ${balanceProfile.wallet}${descriptionEmoji}`}`)
                        .setColor('GREEN')
                ]
            })
        }
        else {
            return userid.id == message.author.id ? message.reply({ content: "You are not registered to the economic system. ||prefix||**register** to register yourself" }) : message.reply({ content: "This user is not registered to the economic system." })
        }
    },
};