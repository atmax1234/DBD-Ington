const client = require('../../index');

module.exports = {
    name: 'ready',
    execute () {
        console.log('The bot is ready to start!');
        require('../../dashboard/app')(client);
    }
}