const { Client, Message, MessageEmbed } = require('discord.js');
const economySchema = require('../../models/Economy/economySchema');

module.exports = {
    name: 'donate',
    aliases: ["pay"],
    description: 'Donate or Pay to someone',
    args: true,
    usage: '<mention/name> <amount>',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const success = "<:Verified_Developer_Badge_SkyBlue:899282294685188139>";
        const emoji = "<:Gold_Coin:939923358877896764>";
        const amount = args[1];
        if (isNaN(amount)) {
            return message.channel.send(`⛔ | Please provide a valid value for the amount you want to give.`);
        }
        let target = message.mentions.members.first() || message.guild.members.cache.find((m) => m.user.username === args[0])
        let Profile = await economySchema.findOne({
            userID: message.author.id
        }).clone();
        if (Profile) {
            if (Profile.wallet < amount) {
                return message.channel.send(`⛔ | Hmm.. You don't seem to have the required amount. Please check your balance.`);
            }
            Profile.wallet -= parseInt(amount)
            await Profile.save()
        }
        else return message.channel.send(`⛔ | You don't seem to have an account yet. Please sign up.`);
        let targetWallet = await economySchema.findOne({
                userID: target.id
            }).clone();
        if (targetWallet) {
            targetWallet.wallet += parseInt(amount);
            await targetWallet.save()
            }
        else {
            return message.reply({ content: "⛔ | This user is not registered to the economic system." })
        }
        message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setAuthor({
                        name: client.user.username,
                        iconURL: client.user.avatarURL()
                    })
                    .setTitle('Transaction Successful')
                    .setColor('GREEN')
                    .setDescription(`${success} The transaction was successful\n**Receiver**: ${target.user.tag}\n**Sender**: ${message.author.tag}\n**Amount**: ${amount}${emoji}\n\nAt: ${new Date().toLocaleString('en-US')}`)
            ]
        });
    }
}