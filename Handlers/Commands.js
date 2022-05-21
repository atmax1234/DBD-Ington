const { glob } = require("glob");
const {promisify} = require("util");
const globPromise = promisify(glob);
module.exports = async (client) =>{
    const commandFile = await globPromise(`${process.cwd()}/Commands/**/*.js`)
    commandFile.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
            if(file.aliases){
                [...file.aliases].forEach(alias => {
                client.commands.set(alias, properties)
                })
            }
        }
        else{
            return console.log('⛔ -> Missing cmd.name or cmd.name is not a string!')
        }
        delete require.cache[require.resolve(`${process.cwd()}/Commands/${directory}/${file.name}.js`)];
    })
}