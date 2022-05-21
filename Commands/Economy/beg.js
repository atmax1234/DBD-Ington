const { Client, Message, MessageEmbed } = require('discord.js');
const economySchema = require('../../models/Economy/economySchema')
const {RandomNumber} = require('../../data/functions/ImportantFunctions');
module.exports = {
    name: 'beg',
    description: 'Try your luck you might get some money',
    cooldown: 50,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
        let balanceProfile = await economySchema.findOne({
            userID: message.author.id
        }).clone()
        if(balanceProfile){
            let amount = RandomNumber(1, 25);
            let chance = RandomNumber(1, 10);
            if(chance >= 1 && chance <= 3){
                const array = [
                    "Fine take my money..",
                    "Take it, this is all I have",
                    "I hope thats enough"
                ];
                balanceProfile.wallet += amount
                await balanceProfile.save()
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setAuthor({
                            name: client.user.username,
                            iconURL: client.user.avatarURL()
                        })
                        .setColor('GOLD')
                        .setTitle(`You just got $${amount}`)
                        .setDescription(`${array[Math.floor(Math.random() * 2)]}`)
                    ]
                })
            }
            else{
                const array = [
                    "I dont feel like it",
                    "Nope",
                    "If I had the money, I would help you.",
                    "Sorry buddy!",
                    "Maybe next time.."
                ];
                message.channel.send(`${array[Math.floor(Math.random() * 4)]}`)
            }
        }
    }
}