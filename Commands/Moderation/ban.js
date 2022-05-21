const { Client, Message, MessageEmbed, Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'ban',
    aliases: ["tempban"],
    args: true,
    usage: "<user> <time> <reason> - set time 0 for permanent",
    userPermissions: ["BAN_MEMBERS"],
    botPermissions: ["BAN_MEMBERS"],
    description: 'Ban someone from your server',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args){
        const user = message.mentions.members.first()
        const userid = user.id
        const time = args[1];
        const reason = args.slice(3).join(' ') || 'No reason provided';

        if(user.roles.highest.position >= message.guild.me.roles.highest.position) return message.reply('I cannot ban this user as their highest role is higher than mine or I have the same highest role as them.');
        if(user.id === message.guild.ownerId) return message.reply('I cannot ban the owner of the server.');
        if(user.id === message.author.id) return message.reply('You cannot ban yourself.');
        if(user.id === message.guild.me.id) return message.reply('I cannot ban myself.');

        if(time === 0){
            let embed = new MessageEmbed()
            .setDescription(`\`(${user.id}) ${user.username}\` has been banned permanently from this server.`)
            .addField("`Reason`", `${reason}`)
            .setColor("RANDOM")
            let userEmbed = new MessageEmbed()
            .setDescription(`\`(${user.id}) ${user.username}\` has been banned permanently from this server.`)
            .addField("`Reason`", `${reason}`)
            .setColor("RANDOM")
            if(!user.bannable) return ('I cannot ban this user')
            try{
                await user.ban({ reason: reason });
                user.send({ embeds: [userEmbed] });
                message.channel.send({ embeds: [embed] });
            }
            catch (e){
                console.log(e)
            }
        }
        else{
            let timeInMs = ms(time)
            if (!timeInMs) return message.reply("The duration for the tempban is invalid. Try again.")
            let embed = new MessageEmbed()
            .setDescription(`\`(${user.id}) ${user.user.username}\` has been temporarily banned for ${time}`)
            .addField("`Reason`", `${reason}`)
            .setColor("RANDOM")
            let userEmbed = new MessageEmbed()
            .setDescription(`\`(${user.id}) ${user.user.username}\` you have been temporarily banned for ${time}`)
            .addField("`Reason`", `${reason}`)
            .setColor("RANDOM")
            if(!user.bannable) return ('I cannot ban this user')
            try{
                await user.ban({ reason: reason });
                user.send({ embeds: [userEmbed] });
                message.channel.send({ embeds: [embed] });
            }
            catch (e){
                console.log(e)
            }
            setTimeout(async () => {
               await message.guild.members.unban(userid)
               let unbannedMemberSend = new MessageEmbed()
               .setDescription(`\`(${user.id}) ${user.user.username}\` your temporary ban has been lifted`)
               .setColor("RANDOM")
             user.send({ embeds: [unbannedMemberSend] }).catch(error => { console.log(error) })
            }, timeInMs)
        }
    }
}