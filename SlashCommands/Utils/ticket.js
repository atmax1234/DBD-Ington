const {
    Client,
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');

module.exports = {
    name: 'ticket',
    description: 'Ticket system!',
    userPermissions: 'ADMINISTRATOR',
    async execute(client, interaction, args){
        const embed = new MessageEmbed()
            .setColor('GOLD')
            .setAuthor({
                name: interaction.guild.name,
                iconURL: interaction.guild?.iconURL({dynamic: true})
            })
            .setDescription(
                "__**How to make a ticket**__\n" +


                "> Please click on the button that relates to your need\n" +

                "> Once the ticket is made you will be redirected to a channel.\n" +
                
                "> There you will be able to contact the support team or admins.\n"

            )
            .setTitle('__**Ticket**__')


        const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('tic')
                .setLabel('📩 Create Ticket!')
                .setStyle('PRIMARY'),
            );

       interaction.followUp({
            embeds: [embed],
            components: [bt]
        });
    }
}