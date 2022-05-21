const client = require("../../index");
const WelcomeModel = require("../../models/Welcome")
const { MessageEmbed, MessageAttachment } = require("discord.js");
const canvacord = require("canvacord")
module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        /**
 * @param {member} member
 */
        await WelcomeModel.findOne({
            guild: member.guild.id
        }, async (err, data) => {
            if (!data) return;
            const Wchannel = member.guild.channels.cache.get(data.channel)
            if(!Wchannel) return;
            const welcomeCard = new canvacord.Leaver()
                .setUsername(member.user.username)
                .setDiscriminator(member.user.discriminator)
                .setAvatar(member.user.displayAvatarURL({ format: "jpg" }))
                .setColor("title", "#b4cdd1")
                .setColor("username-box", "#b4cdd1")
                .setColor("discriminator-box", "#b1bbe0")
                .setColor("message-box", "#b1bbe0")
                .setColor("border", "#b1bbe0")
                .setColor("avatar", "#b1bbe0")
                .setBackground("https://images.unsplash.com/photo-1432847712612-926caafaa802?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80")
                .setMemberCount(member.guild.memberCount)
                .setGuildName(member.guild.name)
            let Wattachment = new MessageAttachment(await welcomeCard.build(), "bye.png")
            Wchannel.send({ files: [Wattachment] });
        }).clone();
    }
}