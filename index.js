const Discord = require('discord.js');
const fs = require('fs')
const db = require(`quick.db`)

const {
    TOKEN,
    PREFIX,
    OWNER,
    STAFF,
} = require('./config.json');

var bot = new Discord.Client();
bot.commands = new Discord.Collection();

function loadCmds() {
    let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    console.log(`${commandFiles.length} commands found.`)
    for (let file of commandFiles) {
        console.log(`Command ${file} loading...`)
        delete require.cache[require.resolve(`./commands/${file}`)];
        let command = require(`./commands/${file}`);
        bot.commands.set(command.config.name, command);
    };
    console.log(`Done! ${commandFiles.length} commands were successfully loaded!`)
};

bot.on('ready', () => {
    console.log(`${bot.user.username} came online!`);
    bot.user.setPresence({ activity: { name: `${PREFIX}help | ${bot.users.cache.size} users` } })
        .then(() => console.log(`Changed the presence of ${bot.user.username} to "${bot.user.presence.activities[0].name}".`))
        .catch(console.error);
});

loadCmds();

bot.on('message', async message => {

    if (message.author.bot) return;
    if(message.guild && !message.content.startsWith(PREFIX)) {
        var data = await db.fetch(`messages_${message.guild.id}_${message.author.id}`) || 
        {
            count: 0,
            target: 50,
            level: 0,
            reward: 250
        }
        data.count = data.count + 1
        db.set(`messages_${message.guild.id}_${message.author.id}`, data)
        if (data.count === data.target) {
            var newData = {
                count: data.count,
                target: Math.round(data.target * 2.25),
                level: data.level + 1,
                reward: Math.round(data.reward * 1.75)
            }
            db.set(`messages_${message.guild.id}_${message.author.id}`, newData)
            db.add(`cash_${message.author.id}`, data.reward)
            message.channel.send(new Discord.MessageEmbed()
                .setColor(`#eb98ff`)
                .setTitle(`Level Up!`)
                .setDescription(`GG! **${message.author.tag}** levelled up!`)
                .addField(`Level`, `Level ${newData.level}`, true)
                .addField(`Reward`, `${data.reward} coins`, true)
                .addField(`Current Balance`, `${db.fetch(`cash_${message.author.id}`)} coins`)
                .setTimestamp(message.createdTimestamp)
            )
        }
    }
    if (!message.content.startsWith(PREFIX)) return;
message.channel.messages.delete()
    var msg = message.content;
    var cont = msg.slice(PREFIX.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    if (command === 'reload') {
        var reloadEmbed = new Discord.MessageEmbed().setTitle(`Error:`).setDescription(`Staff access only.\nAccess denied.`).setColor(`ff0000`)
        if (message.author.id === OWNER || STAFF.includes(message.author.id)) {
            if (args[0]) {
                if (!bot.commands.get(args[0].toLowerCase())) {
                    reloadEmbed.setDescription(`${args[0].toLowerCase()}.js not found.`)
                    return message.channel.send(reloadEmbed)
                }
                delete require.cache[require.resolve(`./commands/${args[0].toLowerCase()}.js`)];
                try {
                    var newCommand = require(`./commands/${args[0].toLowerCase()}.js`);
                    bot.commands.set(newCommand.config.name, newCommand);
                } catch (error) {
                    reloadEmbed.setTitle(`Error while loading command ${args[0].toLowerCase()}`)
                    reloadEmbed.setDescription(`\`\`\`${error}\`\`\``)
                    return message.channel.send(reloadEmbed)
                };
                reloadEmbed.setColor(`#00ff00`)
                reloadEmbed.setTitle(`Reload Successful!`)
                reloadEmbed.setDescription(`Successfully reloaded the command ${args[0].toLowerCase()}!`)
                return message.channel.send(reloadEmbed)
            } else {
                loadCmds()
                reloadEmbed.setColor(`#00ff00`)
                reloadEmbed.setTitle(`Reload Successful!`)
                reloadEmbed.setDescription(`Successfully reloaded all the commands!`)
                return message.channel.send(reloadEmbed)
            };
        } else {
            return message.channel.send(reloadEmbed);
        };
    };

    var cmd = bot.commands.get(command) || bot.commands.find(c => c.config.aliases && c.config.aliases.includes(command));
    if (!cmd) return;
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
        )
    }
    if (cmd.config.staffOnly) {
        if (message.author.id !== OWNER && !STAFF.includes(message.author.id)) {
            return message.channel.send(new Discord.MessageEmbed().setTitle(`Error:`).setDescription(`Staff access only.\nAccess denied.`).setColor(`ff0000`))
        }
    }
    if (cmd.config.guildOnly && message.channel.type !== 'text') {
        return message.reply(`I can't execute the ${cmd.config.name} command inside DMs!`);
    };
    if (message.guild && (await db.fetch(`enabledcmds_${message.guild.id}`) || [])[command] === false) return message.channel.send(new Discord.MessageEmbed()
        .setColor(`#ff0000`)
        .setTitle(`Run failed`)
        .setDescription(`The command **${command}** has been disabled in this server. If you want to use it, please get into contact with the admins of the server and ask them to enable it.`)
        .setFooter(message.author.tag, message.author.avatarURL())
        .setTimestamp(message.createdTimestamp)
    )
    var cmdCooldown = (cmd.config.cooldown || 3) * 1000
    var cooldownData = await db.fetch(`cooldowns_${message.author.id}_${cmd.config.name}`) ||
    {
        lastUsed: message.createdTimestamp - cmdCooldown,
        streak: 0,
        totalUse: 0
    }
    var timeLeft = Math.round(((cooldownData.lastUsed + cmdCooldown) - Date.now()) / 1000)
    if ((message.createdTimestamp - cooldownData.lastUsed) < cmdCooldown) return message.channel.send(new Discord.MessageEmbed().setColor(`#ff0000`).setTitle(`🚫 | Hey, hey! Chill!`).setDescription(`You're on a slowmode! Please wait ${require(`./modules/secondsToDhms.js`)(timeLeft)} to execute the ${cmd.config.name} command again.`));
    var newData = {
        lastUsed: message.createdTimestamp,
        streak: cooldownData.streak,
        totalUse: cooldownData.totalUse + 1
    }
    if ((message.createdTimestamp - cooldownData.lastUsed) < (cmdCooldown * 1.5)) newData.streak = newData.streak + 1
    else newData.streak = 1
    await db.set(`cooldowns_${message.author.id}_${cmd.config.name}`, newData)
    cmd.run(bot, message, args);
});

bot.login(TOKEN);