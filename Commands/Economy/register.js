const econoymSchema = require("../../models/Economy/economySchema");
const { MessageEmbed, Message, Client } = require("discord.js");
const moment = require('moment');
module.exports = {
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  name: "register",
  description: "Register yourself in the economy system.",
  async execute(client, message, args) {
    const econ = await econoymSchema.findOne({ userID: message.author.id }).clone()
    if (econ) return message.reply({ content: `You are already registered to the economic system.\nDate Registered: \`${moment(econ.createdAt).fromNow()}\`` })
    else {
      new econoymSchema({
        guildID: message.guild.id,
        userID: message.author.id,
        createdAt: (Date.now() * 1000) / 1000,
        wallet: + 250
      }).save()
      const registered = new MessageEmbed()
        .setTitle("Registered")
        .setDescription(`\`${message.author.username}\`, you have been registered to the economy system at \`${moment((Date.now() * 1000) / 1000).fromNow()}\`.`)
        .setColor("RANDOM")
        .setTimestamp()
      message.reply({ embeds: [registered] })
    }
  }
}