const Discord = require('discord.js');
const fs = require('fs')
const db = require(`quick.db`)

const {
    TOKEN,
    PREFIXES,
    OWNER,
    STAFF,
} = require('./config.json');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

bot.on(`guildCreate`, (guild) => { require(`./events/guildCreate`)(bot, guild) });

bot.on(`guildDelete`, require(`./events/guildDelete`));

bot.on('ready', () => {
    console.log(`${bot.user.username} came online!`);

    bot.user.setPresence({ activity: { name: `${PREFIXES[0]}help | ${bot.users.cache.size} users` } })
        .then(() => console.log(`Changed the presence of ${bot.user.username} to "${bot.user.presence.activities[0].name}".`))
        .catch(console.error);

    // Backup system
    require(`./support/backup.js`)(bot);
});

require(`./support/reload.js`).deleteAllCache(`./commands`, bot);

bot.on('message', async message => {

    //Ignore bots
    if (message.author.bot) return;

    //XP system
    if (message.guild && !message.content.startsWith(PREFIXES[0])) require(`./support/xp.js`)(message);

    const prefix = require(`./support/prefix.js`)(message, bot.user.id);

    // DM reader & responder
    if (!prefix) {
        if (!message.guild) {
            return require(`./support/dm.js`).saveDM(bot, message);
        };
        if (bot.users.cache.get(message.guild && message.channel.name.split(`-`).reverse()[0]) && message.channel.parentID === `746556626181554199`)
            if (message.author.id === OWNER || STAFF.includes(message.author.id))
                return require(`./support/dm.js`).sendDM(bot, message);
    };

    // Prefix validation
    if (!prefix) return;

    // Util variables
    var msg = message.content;
    var cont = msg.slice(prefix.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    // Reload command
    if (command === 'reload') require(`./support/reload.js`).reload(bot, message, args, OWNER, STAFF);
    
    // Command fetching
    var cmd = bot.commands.get(command) || bot.commands.find(c => c.config.aliases && c.config.aliases.includes(command));
    if (!cmd) return;

    // Blacklist
    // User blacklist
    var userBlacklistData = db.fetch(`blacklist_${message.author.id}`)
    if (userBlacklistData) {
        userBlacklistData = userBlacklistData[0]
        var date = new Date(userBlacklistData.time).toUTCString()
        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor(`#ff0000`)
                .setDescription(`You are blacklisted!`)
                .setDescription(`You are blacklisted from using me and my commands!`)
                .addField(`Responsible moderator`, userBlacklistData.moderator.tag, true)
                .addField(`Reason`, userBlacklistData.reason, true)
                .addField(`Time of blacklist`, date)
        )
    }
    // Server blacklist
    if (message.guild)
        var guildBlacklistData = db.fetch(`blacklist_${message.guild.id}`)
    if (guildBlacklistData) {
        guildBlacklistData = guildBlacklistData[0]
        var date = new Date(guildBlacklistData.time).toUTCString()
        return message.channel.send(
            new Discord.MessageEmbed()
                .setColor(`#ff0000`)
                .setTitle(`Server is blacklisted!`)
                .setDescription(`This server is blacklisted from using me and my commands!`)
                .addField(`Responsible moderator`, guildBlacklistData.moderator.tag, true)
                .addField(`Reason`, guildBlacklistData.reason, true)
                .addField(`Time of blacklist`, date)
        );
    };

    // Staff only commands
    if (cmd.config.staffOnly)
        if (message.author.id !== OWNER && !STAFF.includes(message.author.id))
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle(`Error`)
                .setDescription(`Staff access only.\nAccess denied.`)
                .setColor(`ff0000`)
            );

    // Guild only commands
    if (cmd.config.guildOnly && message.channel.type !== 'text')
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);

    // Server disabled commands
    if (message.guild && (await db.fetch(`enabledcmds_${message.guild.id}`) || [])[command] === false)
        return message.channel.send(new Discord.MessageEmbed()
            .setColor(`#ff0000`)
            .setTitle(`Run failed`)
            .setDescription(`The command **${command}** has been disabled in this server. If you want to use it, please get into contact with the admins of the server and ask them to enable it.`)
            .setFooter(message.author.tag, message.author.avatarURL())
            .setTimestamp(message.createdTimestamp)
        );

    // Cooldown
    const inCooldown = require(`./support/cooldowns.js`)(cmd, message);
    if (inCooldown)
        return message.channel.send(new Discord.MessageEmbed()
            .setColor(`#ff0000`)
            .setTitle(`🚫 | Hey, hey! Chill!`)
            .setDescription(`You're on a slowmode! Please wait ${require(`./modules/secondsToDhms.js`)(inCooldown)} to execute the ${cmd.config.name} command again.`)
        );

    // Run the command
    cmd.run(bot, message, args);
});

bot.login(TOKEN);