const client = require('../../index');

module.exports = {
    /**
     * @param {Client} client
     */
    getTarget: function(id, message) {
        let target;
        target = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === id) || message.guild.members.cache.find((m) => m.user.username === id);
        if (!isNaN || !target) {
            target = message.guild.members.cache.find((m) => m.user.id === id);
        }
        if(target) return target;
        else return 'No user provided'
    },
    getGuild: function (id) {
        //returns guild if the bot is a member
        let callback;
        if (client) {
            const guild = client.guilds.cache.get(id);
            if (guild) {
                callback = guild;
            } else {
                callback = 'Guild not found';
            }
        } else {
            callback = 'Bot not logged in';
        }
        return callback;
    },
    getMessageAuthor: function(message) {
        return message.author;
    },
    MessageSend: async function (data, message) {
        const msg = message.channel.send(data);
        await msg;
        return msg;
    },
    reply: function(data, message) {
        message.reply(data).then((msg) => {
            return msg;
        }).catch(console.log);
    },
    //Interaction Functions
    getInteractionAuthor: function () {
        return interaction.author;
    },
    InteractionSend: async function (data) {
        const response = interaction.channel.send(data);
        await response;
        return response;
    },
    RandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
};