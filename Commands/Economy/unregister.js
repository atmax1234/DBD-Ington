const { MessageActionRow, MessageButton, MessageEmbed} = require("discord.js");
const econoymSchema = require("../../models/Economy/economySchema");

module.exports = {
  name: "unregister",
  description: "Delete all your data from the economic system.",
  async execute(client, message, args){
    const verify = "<:Verified_Developer_Badge_SkyBlue:899282294685188139>";
    const cancel = "<:Do_Not_Disturb:899278492536021002>";

    const econ = await econoymSchema.findOne({ userID: message.author.id }).clone()
    if (!econ) return message.reply({ content: "You are not registered to the economic system. ||prefix||**register** to register yourself" });
    
    const components = (state) => [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("verify")
          .setEmoji(verify)
          .setStyle("SUCCESS")
          .setLabel("Yes")
          .setDisabled(state),
        new MessageButton()
          .setCustomId("deny")
          .setEmoji(cancel)
          .setStyle("DANGER")
          .setLabel("No")
          .setDisabled(state)
      )
    ]
    const initialEmbed = new MessageEmbed()
      .setTitle("UNREGISTER")
      .setDescription(`Are you sure you want to uregister yourself frtom the economy system?`)
      .addField("\u200b", `
      Click ${verify} to unregister.
      Click ${cancel} to cancel the unregistration.
      `)
    const initialMessage = await message.reply({
      embeds: [initialEmbed],
      components: components(false)
    })

    const filter = (i) => {
      if (i.user.id === message.author.id) return true
      else i.deferReply({ content: "this is not for you", ephermal: true })
    }

    const collector = initialMessage.createMessageComponentCollector({
      filter,
      componentType: "BUTTON",
      max: 1,
    })


    collector.on("collect", async (interaction) => {
      interaction.deferUpdate()
      if (interaction.customId === "verify") {
        const editEmbed = new MessageEmbed()
          .setTitle("UNREGISTERED")
          .setDescription(`Your data from the economy system has been deleted.`)
          .setColor("RANDOM")
        initialMessage.edit({ embeds: [editEmbed], components: components(true) })
        econ.delete()
      } else if (interaction.customId === "deny") {
        const editEmbed = new MessageEmbed()
          .setTitle("CANCELLED")
          .setDescription(`You cancelled your unregistration from the economic system.`)
          .setColor("RANDOM")
        initialMessage.edit({ embeds: [editEmbed], components: components(true) })
      }
    })
  },
};