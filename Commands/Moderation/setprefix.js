const { Client, Message, MessageEmbed, Permissions } = require('discord.js');
const db = require('../../models/Prefix')

module.exports = {
    name: 'setprefix',
    description: 'Change the bots prefix into a different one in your server!',
    args: true,
    usage: "<Your New Prefix>",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){

        if(!message.member.permissions.has("ADMINISTRATOR")) return message.reply('You need `ADMINISTRATOR` permission to run this command.')


        const new_prefix = args[0];

        if(new_prefix) {
          let data = await db.findOne({guild: message.guild.id})
        

          if(!data) {
              const new_data = await db.create({
                  prefix: new_prefix,
                  guild: message.guild.id
              })
              new_data.save();
              message.reply(`The server prefix is now changed to \`${new_prefix}\``)
          } 
 
          if(data) {
              await db.findOneAndUpdate({guild: message.guild.id}, { $set: {prefix: new_prefix}})
              message.reply(`The server prefix is now changed to \`${new_prefix}\``)
          }
        
        }

    }
}