const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const block = "⬛";
const heart = "🟥";
module.exports = {
    name: "ship",
    description: "Find out how much 2 people love each other!",
    options: [
        {
            name: "first",
            description: "The first user",
            type: "USER",
            required: true
        },
        {
            name: "second",
            description: "The second user",
            type: "USER",
            required: true
        }
    ],

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    async execute(client, interaction, args){
        const user1 = interaction.options.getUser("first"),
        user2 = interaction.options.getUser("second")
        const embed = new MessageEmbed()
            .setColor('dd2e44')
            .setTitle('Shipping...')
            .setDescription(`Shipped ****${user1.tag}**** and ****${user2.tag}****!`)
            .setImage(`https://api.popcat.xyz/ship?user1=${user1.displayAvatarURL({ dynamic: false, format: "png" })}&user2=${user2.displayAvatarURL({ dynamic: false, format: "png" })}`)
            .addField(`**Ship Meter**`, ship());
        try {
            await interaction.followUp({ embeds: [embed] })
        } catch (error) {
            await interaction.followUp({ content: "An Error Occured" })
        }
        function ship() {
            const hearts = Math.random() * 100;
            const hearte = Math.floor(hearts / 10);

            const str = "💖".repeat(hearte) + "💔".repeat(10 - hearte);
            const str1 = `💟 **${Math.floor(hearts)}%** ${str}`;
            return str1;
        }
    },
};
