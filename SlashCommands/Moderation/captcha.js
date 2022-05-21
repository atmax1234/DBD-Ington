const { Client, CommandInteraction, MessageEmbed, Permissions } = require('discord.js');
const captchaModel = require("../../models/Verification/captcha");
module.exports = {
    name: 'setup-captcha',
    description: 'Setup Captcha',
    options: [
        {
            name: 'role',
            description: 'the role they get when verifying',
            type: 'ROLE',
            required: true,
        }
    ],

    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args 
     */
    async execute(client, interaction, args){
        let error1 = new MessageEmbed()
        .setDescription(`<:error:878555371017469963> | You Need To Have \`Manage Server\` Permissions`)

        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return interaction.followUp({ embeds: [error1] });
        };

        const role = interaction.options.getRole('role');

        captchaModel.findOne({ GuildId: interaction.guildId }, async (err, data) => {
            if(data) {
                data.delete();
            } else {
                new captchaModel({
                    GuildId: interaction.guildId,
                    Role: role,
                }).save();
            };
        });

        let embed = new MessageEmbed()
        .setAuthor({
            name: `Cpatcha Setup Done!`,
            iconURL: client.user.displayAvatarURL({
                dynamic: true
            })
        })
        .setDescription(`Cpatcha's Will be sent to user\'s DM\'s when they join!`)
        .setColor("BLURPLE")

        interaction.followUp({ embeds: [embed] });
    }
}