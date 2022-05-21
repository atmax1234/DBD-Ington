const { Client, Message, MessageEmbed, Collection } = require('discord.js');
const economySchema = require('../../models/Economy/economySchema')
module.exports = {
    name: 'leaderboard',
    aliases: ["lb", "rich"],
    description: 'Displaying top 10 richest users.',
    cooldown: 40000,
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const emoji = "<:Gold_Coin:939923358877896764>";
        const collection = new Collection();
        await Promise.all(
            message.guild.members.cache.map(async member => {
                const id = member.id;
                let Profile = await economySchema.findOne({ userID: id })
                let bal = Profile?.wallet
                if (!bal) return;
                return bal !== 0
                    ? collection.set(id, {
                        id,
                        bal,
                    })
                    : null;
            })
        );
        if (!collection) {
            return message.reply({
                content: `None of the members got ${emoji}!`,
            });
        }
        const ata = collection.sort((a, b) => b.bal - a.bal).first(10);
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Richest users in ${message.guild.name}`)
                    .setDescription(
                        ata
                            .map((v, i) => {
                                return `**${i + 1}❯** ${message.guild.members.cache.get(v.id).user.tag
                                    } ❯ **${v.bal} ${emoji}**`;
                            })
                            .join("\n")
                    )
                    .setTimestamp()
                    .setColor('GOLD'),
            ]
        })
    }
}