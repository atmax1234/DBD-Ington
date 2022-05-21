const client = require('../../index');
const { Permissions, MessageEmbed, Collection, Message} = require("discord.js");
const Timeout = new Map();
const pxdb = require('../../models/Prefix');
const economySchema = require("../../models/Economy/economySchema");
const {RandomNumber} = require('../../data/functions/ImportantFunctions');
const ms = require('ms')
module.exports = {
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
	name: 'messageCreate',
	async execute(message) {
		const data = await pxdb.findOne({
			guild: message.guild.id
		});
		let prefix;
		if(data){
			prefix = data.prefix
		}
		else{
			prefix = "!"
		}
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(" ");
	let balanceProfile = await economySchema.findOne({
		userID: message.author.id,
	}).catch((err) => console.log(err))
	if(balanceProfile){
		let messageGive = RandomNumber(2, 7)
		balanceProfile.wallet += messageGive
		await balanceProfile.save()
	}
    const command = client.commands.get(cmd.toLowerCase() || client.aliases.get(cmd.toLowerCase()));
	if(!command) return;
		//GuildOnly: true/false
		if (command.GuildOnly && message.channel.type === 'dm') {
			return message.reply('I can\'t execute that command inside DM\'s!');
		}
		/*  userPermissions: ["COMMAND PERMISSION"],
				botPermissions: ["COMMAND PERMISSION"], 
			or
			userPermissions: "COMMAND PERMISSION",
			botPermissions: "COMMAND PERMISSION",

			Supports Multiple Permissions!
		*/
		if (!message.member.permissions.has(command.userPermissions || [])) {
			const userPermission = new MessageEmbed()
				.setTitle("MISSING PERMISSIONS")
				.setDescription(
					`You are missing \`${command.userPermissions
						.join(", ")
						.replace(/\_/g, " ")}\``
				)
				.setColor("RED")
				.setTimestamp();
			message.channel.send({ embeds: [userPermission] });
		}

		if (!message.guild.me.permissions.has(command.botPermissions || [])) {
			const userPermission = new MessageEmbed()
				.setTitle("MISSING PERMISSIONS")
				.setDescription(
					`I am missing \`${command.botPermissions
						.join(", ")
						.replace(/\_/g, " ")}\``
				)
				.setColor("RED")
				.setTimestamp();
			message.channel.send({ embeds: [userPermission] });
		}
		// Did we expected any args? if so then print command.usage for more info
		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			return message.channel.send(reply);
		}
		const timeout = command.cooldown * 1000;
		const key = message.author.id + command.name;
		const found = Timeout.get(key);
		if(found) {
		  const timePassed = Date.now() - found;
		  const timeLeft = timeout - timePassed;
		  return message.channel.send({
			  embeds: [
				  new MessageEmbed()
				  .setTitle('**⏳ | You Are In Cooldown **')
				  .setDescription(`**Slow down buddy**\nYou can use this command again in **${ms(timeLeft, { long: true })}**`)
				  .setThumbnail(message.author.avatarURL({dynamic: true}))
			  ]
		  })
		}
		Timeout.set(key, Date.now());

		setTimeout(() => {
		   Timeout.delete(key);
		}, timeout);
		try {
			await command.execute(client, message, args);
		}
		catch(err) {
			console.error(err);
			message.reply('There was an error trying to execute that command!');
		}
	}
}