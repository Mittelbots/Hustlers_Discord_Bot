const { Permissions } = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if(!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
        return message.reply("Du hast keine Berechtigung dafür");
    }
    let value = args[0].replaceAll('<', '').replaceAll('@', '').replaceAll('!', '').replaceAll('>', '');
    try{
        var member = await message.guild.members.fetch(value);
    }catch (err){
        return message.reply("Der Benutzer wurde nicht gefunden!");
    }
    try{
        member.kick();
        return message.reply("Die Person wurde vom Discord geworfen!");
    }catch (err){
        return message.reply("Irgendwas ist schief gelaufen!");
    }
}
module.exports.help = {
    name: "kick",
    description: "kickt personen vom Discord!",
    usage: "",
}
