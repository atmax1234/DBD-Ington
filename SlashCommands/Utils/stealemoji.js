const { CommandInteracion, Client, MessageEmbed, Util, Permissions } = require('discord.js');

module.exports = {
   name: 'stealemoji',
   description: 'Steal an emoji from another server',
    options: [{name: 'emoji', type: "STRING", description: "The emoji you want to steal", require: true}], // you dont have to include these in some commands
   /**
   *
   * @param {Client} client
   * @param {CommandInteracion} interaction
   * @param {String[]} args
   */
 async execute(client, interaction, args){

    if(!interaction.member.permissions.has([Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS])) return interaction.reply({content: `You are not a staff member!`, ephemeral: true})
    if(!args.length) return interaction.reply({content: `Please supply some emojis`, ephemeral: true})
    if(args.length > 10) return interaction.reply({content: `Can only added 10 emojis at each time!`, ephemeral: true})
    for(const rawEmojis of args) {
        const parsedEmoji = Util.parseEmoji(rawEmojis)
        if(parsedEmoji.id) {           
            const exe = parsedEmoji.animated ? ".gif" : ".png"
            const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + exe}`
            interaction.guild.emojis.create(url, parsedEmoji.name).then((e) => {
                interaction.followUp({content: `Added ${e} - \`${e.url}\``, ephemeral: true})                
                });
            };
        };
    }
};