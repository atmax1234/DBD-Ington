const client = require('../../index');
const {
    Message, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment
} = require('discord.js');
const ticket = require('../../models/Ticket/ticket-panels');
const sourcebin = require('sourcebin_js');
const tickets = require('../../models/Ticket/ticket-user')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.isCommand()) {
            await interaction.deferReply().catch(() => { });

            const cmd = client.slashCommands.get(interaction.commandName);
            if (!cmd) return interaction.followUp({ content: "An error has occured" });
            if (!interaction.member.permissions.has(cmd.userPermissions || [])) {
                const userPermission = new MessageEmbed()
                    .setTitle("MISSING PERMISSIONS")
                    .setDescription(
                        `You are missing \`${cmd.userPermissions
                            .join(", ")
                            .replace(/\_/g, " ")}\``
                    )
                    .setColor("RED")
                    .setTimestamp();
                interaction.followUp({ embeds: [userPermission] });
            }

            if (!interaction.guild.me.permissions.has(cmd.botPermissions || [])) {
                const userPermission = new MessageEmbed()
                    .setTitle("MISSING PERMISSIONS")
                    .setDescription(
                        `I am missing \`${cmd.botPermissions
                            .join(", ")
                            .replace(/\_/g, " ")}\``
                    )
                    .setColor("RED")
                    .setTimestamp();
                interaction.followUp({ embeds: [userPermission] });
            }
            const args = [];

            for (let option of interaction.options.data) {
                if (option.type === 'SUB_COMMAND') {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value)
                    });
                } else if (option.value) args.push(option.value)
            }
            interaction.member = interaction.guild.members.cache.get(interaction.user.id);

            cmd.execute(client, interaction, args);
        }
        if (interaction.isButton()) {
            const data = await ticket.findOne({ guild: interaction.guildId })
            if (!data) {
                new ticket({ guild: interaction.guild.id }).save()
            }
            const db = await tickets.findOne({ guild: interaction.guildId })
            if (db === null || !db) {
                new tickets({ guild: interaction.guild.id }).save()
            }
            if(data === null) return interaction.channel.send('The Guild is not registered in our database!\nPlease Delete this ticket and reopen it again to register it!')
            if (interaction.customId === 'tic') {
                const ch2 = interaction.guild.channels.cache.get(db?.channel)
                if (ch2) return interaction.reply({ content: 'You still have a ticket open!', ephemeral: true })
                if (!ch2) {
                    interaction.deferUpdate();
                    const channel = await interaction.guild.channels.create(`ticket - ${data?.index + 1}  `, {
                        type: 'text',
                        permissionOverwrites: [{
                            id: interaction.guild.id,
                            deny: ['VIEW_CHANNEL'],
                        },],
                    });
                    channel.permissionOverwrites.edit(interaction.member, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true,
                        ATTACH_FILES: true,
                        READ_MESSAGE_HISTORY: true,
                    });
                    const embed = new MessageEmbed()
                        .setTitle('__**Ticket Opened!**__')
                        .setDescription('Hello there, \n The staff will be here as soon as possible mean while tell us about your issue!\nThank You!')
                        .addField(`Opened by:`, `${interaction.user.tag}`)
                        .setColor('GOLD')
                        .setTimestamp()
                        .setAuthor({
                            name: interaction.guild.name, iconURL: interaction.guild.iconURL({
                                dynamic: true
                            })
                        });

                    const del = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('del')
                                .setLabel('🔒 Close Ticket!')
                                .setStyle('SECONDARY'),
                        );
                    channel.send({
                        content: `Welcome <@${interaction.user.id}>`,
                        embeds: [embed],
                        components: [del]
                    })
                    if (db === null || !db) {
                        new tickets({ guild: interaction.guild.id }).save()
                    }
                    let a;
                    a = data?.index
                    if(isNaN(a)) a = 1
                    b = ++a;
                    await data.updateOne({ index: b });
                    await db?.updateOne({ user: interaction.user.id, channel: channel.id });
                }
            } else if (interaction.customId === 'del') {
                interaction.deferUpdate();
                const del3 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('close')
                            .setLabel('🗑️ Delete Ticket!')
                            .setStyle('DANGER'),
                        new MessageButton()
                            .setCustomId('reop')
                            .setLabel('🔓 Re Open Ticket!')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('tsc')
                            .setLabel('📝 Transcript of the Ticket!')
                            .setStyle('SECONDARY'),
                    )
                interaction.channel.permissionOverwrites.edit(interaction.member, {
                    SEND_MESSAGES: false,
                    VIEW_CHANNEL: false,
                });
                interaction.channel.send({
                    content: 'Admin Buttons!',
                    components: [del3]
                })
            } else if (interaction.customId === 'close') {
                interaction.deferUpdate();
                if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.channel.send({ content: "You don't have permissions for this!" })
                interaction.channel.send('Ticket will be deleted in a few seconds!')
                await new Promise(res => setTimeout(res, 5000));
                interaction.channel.delete()
                db.delete()
            } else if (interaction.customId === 'reop') {
                interaction.deferUpdate();
                if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.channel.send({ content: "You don't have permissions for this!" })
                const user = interaction.guild.members.cache.get(db.user)
                interaction.channel.permissionOverwrites.edit(user, {
                    SEND_MESSAGES: true,
                    VIEW_CHANNEL: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                });
            } else if (interaction.customId === 'tsc') {
                interaction.deferUpdate();
                if (!interaction.member.permissions.has('MANAGE_CHANNELS')) return interaction.channel.send({ content: "You don't have permissions for this!" })
                interaction.channel.messages.fetch().then(async (messages) => {
                    const output = messages.reverse().map(m => `${new Date(m.createdAt).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
                    let response;
                    try {
                        response = await sourcebin.create([
                            {
                                name: ' ',
                                content: output,
                                languageId: 'text',
                            },
                        ], {
                            title: `Chat transcript for ${interaction.channel.name}`,
                            description: ' ',
                        });
                    } catch (e) {
                        console.log(e)
                        return interaction.channel.send('An error occurred, please try again!');
                    }

                    const embed = new MessageEmbed()
                        .setDescription(`[\`📄 View\`](${response.url})`)
                        .setColor('GREEN');
                    interaction.channel.send({ content: 'the transcript is complete. Please click the link below to view the transcript', embeds: [embed] });
                });
            }
        }
    }
}