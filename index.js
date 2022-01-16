const {Client, MessageEmbed} = require("discord.js");

const token = require('./token.json');

const config = require('./config.json');

const bot = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"]
  });

bot.on('guildMemberAdd', member => {
    console.log(member)
    let m = new MessageEmbed()
    .setTitle(`Willkommen auf ${member.guild.name}, ${member.user.username}`)
    .setThumbnail(member.guild.iconURL())
    .setDescription(`${config.welcome_message.desc}`)
    .addField(`${config.welcome_message.field1[0]}`, ` 
    ${ member.guild.channels.cache.find(c => c.id === config.welcome_message.rollevergabe) } - ${config.welcome_message.field1[1]}" 
    ${config.welcome_message.field1[2]}
    `)
    .addField(`‎`, `${member.guild.channels.cache.find(c => c.id === config.welcome_message.abmeldung)} - ${config.welcome_message.field2[0]}`)
    .setTimestamp()

    member.send({embeds: [m]})
});


bot.on('messageCreate', message => {
    if(message.content === '!d') {
        let m = new MessageEmbed()
        .setTitle(`Willkommen auf ${message.guild.name}, ${message.author.username}`)
        .setThumbnail(message.guild.iconURL())
        .setDescription(`In dieser Nachricht wird dir alles wichtige rund um den Server erklärt`)
        .addField(`Bevor du etwas anderes schreibst MUSST du vorher diesen Schritt befolgen!`, ` 
        ${ message.guild.channels.cache.find(c => c.id === "821072087099113513") } - In den Channel gehört: "Rangnummer | InGame Name | ServerID" 
        _Beispiel: "4 | Max Mustermann | 1234"_
        `)
        .addField(`‎`, `${message.guild.channels.cache.find(c => c.id === "821072087099113513")} - Hier kannst du nicht für **EINEN TAG** abmelden.`)
        .setTimestamp()

        message.channel.send({embeds: [m]})
    }
});

bot.once('ready', () => {
    console.log('BOT STARTED!!')
});

bot.login(token.token)