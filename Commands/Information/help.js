const { Client, Message, MessageEmbed, MessageButton } = require('discord.js');
const pxdb = require('../../models/Prefix');
const pagination = require('discordjs-button-pagination');
const { readdirSync } = require("fs");

module.exports = {
    name: 'help',
    description: 'Provides the help command',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    async execute(client, message, args) {
        const data = await pxdb.findOne({
            guild: message.guild.id
        });
        let prefix;
        if (data)
            prefix = data.prefix
        else
            prefix = "!"
        let categories = [];
        readdirSync("./Commands").forEach((dir) => {
            const commands = readdirSync(`./Commands/${dir}/`).filter((file) =>
                file.endsWith(".js")
            );

            const cmds = commands.map((command) => {
                let file = require(`../../Commands/${dir}/${command}`);

                if (!file.name) return "No command name.";

                let name = file.name.replace(".js", "");
                let description = file.description;

                return `\`${name}\` : ${description} \n`;
            });

            let data = new Object();

            data = {
                name: dir.toUpperCase(),
                value: cmds.length === 0 ? "In progress." : cmds.join(" "),
            };

            categories.push(data);
        });
        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`**Server: ${message.guild.name}**`)
            .setDescription(`Prefix: **\`${prefix}\`**\nCommands: **\`${client.commands.size}\`**`)
        const embed1 = new MessageEmbed()
            .setTitle(" Need help? Here are all of my commands:")
            .addFields(categories)
            .setColor('RANDOM')
        const pages = [
            embed,
            embed1
            // .setDescription(`**${command.name.replace(/-/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}**\n\`${command.description}\`\n**Aliases**\n${command.aliases?.length ? command.aliases.map(alias => `\`${prefix}${alias}\``).join('\n') : 'None'}\n**Usage**\n\`${prefix}${command.name} ${command.usage ?? ''}\``)
        ];
        const button1 = new MessageButton()
            .setCustomId('previousbtn')
            .setLabel('Previous')
            .setStyle('DANGER');

        const button2 = new MessageButton()
            .setCustomId('nextbtn')
            .setLabel('Next')
            .setStyle('SUCCESS');
        const buttonList = [
            button1,
            button2
        ];
        const timeout = 120000;
        pagination(message, pages, buttonList, timeout);
    }
}