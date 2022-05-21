const { glob } = require('glob');
const { promisify } = require('util');
const globPromise = promisify(glob);

module.exports = async (client) => {
    const slashCommandsDir = await globPromise(`${process.cwd()}/SlashCommands/**/*.js`);
    const slashCommandsArray = [];
    slashCommandsDir.map((value) => {
        const file = require(value);
        let cmdName;
        let cmdOption;
        if (!file?.name) return cmdName = 'Missing / Invalid Command Name', cmdOption = '❌';
        else {
            cmdName = file.name;
            cmdOption = '✅';
        }
        if (cmdOption == '✅') {
            client.slashCommands.set(file.name, file);
            if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
            slashCommandsArray.push(file);
        }
        console.log(`Loaded: ${cmdOption} | ${cmdName}`);
        delete require.cache[require.resolve(`${value}`)];
    })

    client.on('ready', async () => {
        await client.guilds.cache.get('907643166386167830').commands.set(slashCommandsArray);
    })
}
