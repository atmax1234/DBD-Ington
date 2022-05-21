const { Client, Message, MessageEmbed, Permissions } = require('discord.js');
const db = require('../../models/Welcome')

module.exports = {
    name: 'set-welcome',
    description: 'Set an welcome announcment channel',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){

        if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply('You need `ADMINISTRATOR` permission to run this command.')


        const new_channel = message.mentions.channels.first();
        if(!new_channel) return message.reply({content: 'Please specify a new channel you want to set/change!'})

        if(new_channel) {
          let data = await db.findOne({guild: message.guild.id})
        

          if(!data) {
              const new_data = await db.create({
                  channel: new_channel,
                  guild: message.guild.id
              })
              new_data.save();
              message.reply(`You successfully set the welcome channel to \`${new_channel}\``)
          } 
 
          if(data) {
              await db.findOneAndUpdate({guild: message.guild.id}, { $set: {channel: new_channel}})
              message.reply(`The welcome channel is now changed to \`${new_channel}\``)

          }
        
        }

    }
}