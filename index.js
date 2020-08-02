const Discord = require('discord.js');
const fs = require('fs')
const db = require(`quick.db`)

const {
    TOKEN,
    PREFIX,
    OWNER,
    STAFF,
} = require('./config.json');
const { time } = require('console');

var bot = new Discord.Client();
bot.commands = new Discord.Collection();
var cooldowns = new Discord.Collection();

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
        var data = await db.fetch(`messages_${message.guild.id}_${message.author.id}`)
        if (!data) data = {
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
                .setDescription(`GG! ${message.author.tag} just levelled up!\n\nLevel:\`\`\`Level ${newData.level}\`\`\`Reward:\`\`\`${data.reward} coins\`\`\`Current balance:\`\`\`${db.fetch(`cash_${message.author.id}`)} coins\`\`\``)
            )
        }
    }
    if (!message.content.startsWith(PREFIX)) return;

    var msg = message.content;
    var cont = msg.slice(PREFIX.length).split(/ +/);
    var command = cont[0].toLowerCase();
    var args = cont.slice(1);

    if (command === 'reset-cooldowns') {
        if (message.author.id !== OWNER && !STAFF.includes(message.author.id)) return message.channel.send(new Discord.MessageEmbed().setTitle(`Error:`).setDescription(`Staff access only.\nAccess denied.`).setColor(`ff0000`))
        cooldowns = new Discord.Collection();
        message.channel.send(new Discord.MessageEmbed().setColor(`#00ff00`).setTitle(`Cooldown reset!`).setDescription(`Successfully reset all the cooldowns!`))
    }

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

    if (!cooldowns.has(cmd.config.name)) {
        cooldowns.set(cmd.config.name, new Discord.Collection());
    };
    var now = Date.now();
    var timestamps = cooldowns.get(cmd.config.name);
    var cooldownAmount = (cmd.config.cooldown || 1) * 1000;
    if (timestamps.has(message.author.id)) {
        var expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            var timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(new Discord.MessageEmbed().setColor(`#ff0000`).setTitle(`🚫 | Hey, hey! Chill!`).setDescription(`You're on a slowmode! Please wait ${require(`./modules/secondsToDhms.js`)(timeLeft.toFixed(0))} to execute the ${cmd.config.name} command again.`));
        };
    };
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    cmd.run(bot, message, args);
});

bot.login(TOKEN);