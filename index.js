const {
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");

const token = require('./token.json');

const config = require('./config.json');

const bot = new Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"]
});

bot.on('guildMemberAdd', member => {
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

    member.send({
        embeds: [m]
    })
});


bot.on('messageCreate', async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.author.system) return;

    if (message.channel.id === config.welcome_message.rollevergabe) { //#rollenvergabe
        /**
        TO-DO
            - User schreibt message 9 | name | 123 ✅
            - bot reagiert drauf x und hacken ✅
            - reaction only with 8-10 roles ✅
            - wenn hacken -> give author roles + change nickname to message.content ✅
            - wenn x -> send dm to user with right template + delete message ✅
        */
        // await message.react(bot.emojis.cache.get(config.reaction.emotes.accept)).catch(err => {/** NO PERMISSION */ console.log(err) });
        // await message.react(bot.emojis.cache.get(config.reaction.emotes.deny)).catch(err => {/** NO PERMISSION */ console.log(err)});


        const accept = 'accept';
        const deny = 'deny';

        const buttons = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId(accept)
                .setLabel(accept)
                .setStyle('PRIMARY')
            )
            .addComponents(
                new MessageButton()
                .setCustomId(deny)
                .setLabel(deny)
                .setStyle('DANGER')
            )

        const sentMessage = await message.channel.send({
            content: `<@${message.author.id}> ${message.content}`,
            components: [buttons]
        }, )

        const filter = (user) => {
            var pass = false;
            user.member.roles.cache.forEach(r => {
                for (let i in config.reaction.allowed_roles) {
                    if (r.id === config.reaction.allowed_roles[i]) {
                        pass = true;
                    }
                }
            });
            return pass;
        }

        const collector = sentMessage.createMessageComponentCollector({
            max: 1,
            filter
        });

        collector.on('collect', async interaction => {
            interaction.deferUpdate();

            if (interaction.customId === accept) {
                let x = 0;
                let roleic;
                while (message.content[x] === ' ' && message.content[x] !== undefined) {
                    x++;
                }
                if (message.content[x] === '1' && message.content[x + 1] === '0') {
                    sentMessage.delete();
                    message.delete();
                    return message.author.send(`Deine Nachricht in ${message.guild.channels.cache.get(config.welcome_message.rollevergabe)} wurde abgewiesen. Da kein antrag auf die Rolle "10" gegeben werden darf.`); 
                }
                message.delete();
                roleic = message.content[x];

                const user_role = message.guild.roles.cache.find(r => r.name.startsWith(message.content[x]))
                const member_role = message.guild.roles.cache.find(r => r.id === config.member_role);

                for(let i = 1; i <= 8; i++) {
                    await message.member.roles.remove(message.guild.roles.cache.find(r => r.id === config.roles[i])).catch(err => console.log(err))
                }

                await message.guild.members.cache.get(message.author.id).roles.add([user_role])
                await message.guild.members.cache.get(message.author.id).roles.add([member_role])

                await message.member.setNickname(message.content).catch(err => { /** NO PERMISSIONS */})
            }else {
                await message.author.send(`Deine Nachricht ("${message.content}") in ${message.guild.channels.cache.get(config.welcome_message.rollevergabe)} wurde abgewiesen. Bitte schaue nocheinmal wie du die Nachricht gestalten sollst! **(RANG | INGAME NAME | INGAME-ID)**`)
                await message.delete();
                await sentMessage.delete();
            }
        });

        collector.on('end', (collected, reason) => {
            collected.forEach(x => {
                for (let i in buttons.components) {
                    if (buttons.components[i].customId === x.customId) {
                        buttons.components[i].setStyle('SUCCESS');
                    }
                    buttons.components[i].setDisabled(true)
                }
                sentMessage.edit({
                    content: `<@${message.author.id}> ${message.content}`,
                    components: [buttons]
                })
            });

            return;
        });
    }

    if (message.content === '!d') {
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

        message.channel.send({
            embeds: [m]
        })
    }
});

bot.once('ready', () => {
    console.log('BOT STARTED!!')
    bot.guilds.cache.get(config.guild_id).channels.cache.get(config.welcome_message.rollevergabe).send(`**Bot neugestartet.** \nAnfragen die noch nicht aktzeptiert oder abgelehnt wurden MÜSSEN erneut geschrieben werden!`)
});

bot.login(token.token)