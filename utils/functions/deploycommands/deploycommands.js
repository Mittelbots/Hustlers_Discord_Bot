const fs = require('fs');

const config = require('../../../config.json');

function deployCommands(bot) {
        let modules = fs.readdirSync('./src/commands/');
        modules.forEach((module) => {
            fs.readdir(`./src/commands/${module}`, (err, files) => {
                if (err) {
                    if (config.debug == 'true') console.log(`Mission Folder!!`, err);
                }
                files.forEach((file) => {
                    if (!file.endsWith('.js')) return;
                    var command = require(`../../../src/commands/${module}/${file}`);
                    console.log(`${command.help.name} Command has been loaded!`);
                    if (command.help.name) bot.commands.set(command.help.name, command)
                })
            });
        });
    return;
}

module.exports = {deployCommands};