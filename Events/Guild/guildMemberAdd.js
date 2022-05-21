const client = require("../../index")
const captchaModel = require("../../models/Verification/captcha");
const WelcomeModel = require("../../models/Welcome")
const { MessageEmbed, MessageAttachment } = require("discord.js");
const canvacord = require("canvacord")
const { Captcha } = require('captcha-canvas');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        /**
 * @param {member} member
 */
        await WelcomeModel.findOne({
            guild: member.guild.id
        }, async (err, data) => {
            if (!data) {
                console.log("No data for welcome channel model")
                return;
            }
            const Wchannel = member.guild.channels.cache.get(data.channel)
            const welcomeCard = new canvacord.Welcomer()
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
            let Wattachment = new MessageAttachment(await welcomeCard.build(), "welcome.png")
            Wchannel.send({ files: [Wattachment] });
        });

        captchaModel.findOne({ GuildId: member.guild.id }, async (err, data) => {
            if (!data) return;
            if (member.user.bot) return;
            const captcha = new Captcha();
            captcha.async = true;
            captcha.addDecoy();
            captcha.drawTrace();
            captcha.drawCaptcha();

            const attachment = new MessageAttachment(
                await captcha.png,
                "captcha.png"
            );
            const msg = await member.send({ files: [attachment], content: 'Please Write What You See On The Image Bellow To Gain Member Permissions!', }).catch((err) => {
                console.log(err)
            })

            const role = member.guild.roles.cache.get(data.Role);

            const filter = (message) => {
                if (message.author.id !== member.id) return;
                if (message.content === captcha.text) return true;
                else member.send(`<:error:878555371017469963> Wrong Captcha Text!`)
            };

            const resp = await msg.channel.awaitMessages({
                filter,
                max: 1,
                time: 60000,
                errors: ["time"],

            });
            if (resp) {
                member.roles.add(role);
                member.send(`😊 Thank You! Now Enjoy The Server.`)
            }
        })
    }
}