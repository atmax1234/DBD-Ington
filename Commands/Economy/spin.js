const { MessageEmbed } = require("discord.js");
const economySchema = require("../../models/Economy/economySchema");

module.exports = {
	name: "spin",
	aliases: ["slots"],
	description: 'Spin the wheel',
	cooldown: 90000,
	async execute(client, message, args) {
		const descriptionEmoji = "<:Gold_Coin:939923358877896764>";
		let profile = await economySchema.findOneAndUpdate({ userID: message.author.id })
		if (profile.wallet < 250) return message.channel.send("⛔ | You need at least 250 coins to spin the wheel!")
		let user = message.member;
		var replys1 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys2 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys3 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys4 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys5 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys6 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys7 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys8 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		var replys9 = [
			":lemon:", ":bell:", ":cherries:", ":star:", ":gem:", ":seven:"
		];
		let reponse1 = (replys1[Math.floor(Math.random() * replys1.length)])
		let reponse2 = (replys2[Math.floor(Math.random() * replys2.length)])
		let reponse3 = (replys3[Math.floor(Math.random() * replys3.length)])
		let reponse4 = (replys4[Math.floor(Math.random() * replys4.length)])
		let reponse5 = (replys5[Math.floor(Math.random() * replys5.length)])
		let reponse6 = (replys6[Math.floor(Math.random() * replys6.length)])
		let reponse7 = (replys7[Math.floor(Math.random() * replys7.length)])
		let reponse8 = (replys8[Math.floor(Math.random() * replys8.length)])
		let reponse9 = (replys9[Math.floor(Math.random() * replys9.length)])

		let random = Math.floor((Math.random() * 500000)) + 1;
		const embed1 = new MessageEmbed()
			.setTitle("🎰 Spin the prize!")
			.setDescription(`**🎊 In the big chest there are ${random}${descriptionEmoji}**`)
			.setFooter({ text: "Flame Game • DiscordBot" })
			.setColor("BLUE");
		const msg1 = message.channel.send({ embeds: [embed1] })
		if (reponse4 === reponse5 === reponse6) {
			const embed = new MessageEmbed()
				.setTitle("🎰 Spin completed!")
				.setDescription(`============\n**>>** ${reponse1} : ${reponse2} : ${reponse3} **<<**\n**➤**  ${reponse4} : ${reponse5} : ${reponse6}  **⮜**\n**>>** ${reponse7} : ${reponse8} : ${reponse9} **<<**\n============`)
				.setFooter({ text: `🔥 Big win!!! 🎊 Your reward is ${random} coins` })
			message.channel.send({ embeds: [embed] })
			profile.wallet += random
			await profile.save().catch((err) => {
				console.log(err)
			});


		} else {
			const random1 = Math.floor((Math.random() * 600)) + 1;

			message.channel.send({
				embeds: [
					new MessageEmbed()
						.setTitle("🎰 Spin completed!")
						.setDescription(`============\n**>>** ${reponse1} : ${reponse2} : ${reponse3} **<<**\n**➤** ${reponse4} : ${reponse5} : ${reponse6} **⮜**\n**>>** ${reponse7} : ${reponse8} : ${reponse9} **<<**\n============`)
						.setFooter({ text: `You have received ${random1} coins` })
				]
			})
			profile.wallet += random1
			await profile.save().catch((err) => {
				console.log(err)
			});
		}


	}
}