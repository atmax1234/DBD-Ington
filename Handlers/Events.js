const { glob } = require("glob");
const {promisify} = require("util");
const globPromise = promisify(glob);

module.exports = async (client) =>{
    const eventFiles = await globPromise(`${process.cwd()}/Events/**/*.js`);
    eventFiles.map((file) => {
        const event = require(file);
        let eventName = event.name || 'No event name';
        if(eventName != 'No event name'){
            if(event.once){
                client.once(event.name, (...args) => event.execute(...args));
            }
            else{
                client.on(event.name, (...args) => event.execute(...args));
            }
        }
        else{
            console.log(`⛔ ${eventName}`)
        };
        delete require.cache[require.resolve(`${file}`)];
    })
};