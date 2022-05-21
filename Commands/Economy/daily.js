const { Client, Message, MessageEmbed } = require('discord.js');
const economySchema = require("../../models/Economy/economySchema");
const {RandomNumber} = require('../../data/functions/ImportantFunctions');
const ms = require('pretty-ms');
require('mongoose');
module.exports = {
    name: 'daily',
    description: 'Get your daily reward',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
        const emoji = "<:Gold_Coin:939923358877896764>";
        const dailies = RandomNumber(2, 25)
        let balanceProfile = await economySchema.findOneAndUpdate({
            userID: message.author.id
        }).clone()
        if(balanceProfile){
            let timeout = 86400000
            if(timeout - (Date.now() - balanceProfile.daily) > 0){
                let timeleft = ms(timeout - (Date.now() - balanceProfile.daily), {verbose: true})
                return message.reply(`You already claimed your reward for today!\nEstimated time: \`${timeleft}\``)
            }
            balanceProfile.daily = Date.now()
            const money = balanceProfile.wallet + dailies
            const embed = new MessageEmbed()
            .setTitle('Here\'s your reward for today')
            .setColor('GREEN')
            .setDescription(`You\'ve just got ${dailies}${emoji}\n You now have: ${money}${emoji}\n Congrats on that crazy amount!`)
            balanceProfile.wallet = money
            await balanceProfile.save().catch((err) => {
                console.log(err)
            })
            message.channel.send({
                embeds: [embed]
            });
        }
        else{
            return message.reply({ content: "You are not registered to the economic system. ||prefix||**register** to register yourself" })
        }
    },
}