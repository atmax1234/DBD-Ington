const { Client, Collection } = require("discord.js");
require('dotenv').config()
const client = new Client({
    intents: 32767
});

client.commands = new Collection()
client.slashCommands = new Collection()
client.aliases = new Collection()

require("./Handlers/Events")(client)
require("./Handlers/Commands")(client)
require("./Handlers/Slash-Commands")(client)

process.on("unhandledRejection", async(reason, p) => {
    console.log("⛔ [Anti-Crash]: Unhandled Rejection/Catch");
    console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
    console.log("⛔ [Anti-Crash]: Uncaught Exception/Catch");
    console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log("⛔ [Anti-Crash]: Uncaught Exception/Catch (MONITOR)");
    console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
    console.log("⛔ [Anti-Crash]: Multiple Resolves");
    console.log(type, promise, reason);
});

const mongoose = require("mongoose");
if (!process.env.MONGODB_URL) return;

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the Database!')
}).catch((err) => {
    console.log(err);
});

client.login(process.env.DISCORD_TOKEN)
module.exports = client;