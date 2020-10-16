exports.config = {
    name: "leaderboard",
    aliases: ["leader", "rich", "top", "leaders"],
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Places a random amount of coins in your wallet.",
    usage: "beg",
    category: "Economy",
};

const db = require(`quick.db`);
const { MessageEmbed } = require(`discord.js`);

const economyAliases = ["economy", "coins", "cash", "balance", "bal", "money"];
const xpAliases = ["xp", "messages", "msgs", "message", "msg", "exp", "experience", "chat"];

exports.run = async (bot, message, args) => {

    const resp = db.all();

    function fetchDB(key) {
        const rtn = [];
        for (let currentDb of resp) {
            if (currentDb.ID.startsWith(key) && !rtn.includes(currentDb)) rtn.push(currentDb);
        }
        return rtn;
    }

    // No args specified
    if (!args[0]) return message.channel.send(`🚫 | Please specify the category of which leaderboards you want to check.`);

    // Economy leaderboard
    if (economyAliases.includes(args[0].toLowerCase())) {
        const economyEmbed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`Economy Leaderboard`)
            .setFooter(message.author.tag, message.author.avatarURL({ dynamic: true }));

        const data = fetchDB(`cash_`);
        data.sort((a, b) => (a.data < b.data) ? 1 : -1);
        for (let i = 0; i < 10; i++) {
            const currentDb = data[i];
            if (!currentDb) break;
            economyEmbed.setDescription(`${economyEmbed.description || ``}${i + 1}. **${(bot.users.cache.get(currentDb.ID.split(`_`)[1]) || {tag: "Unknown User"}).tag}** - ${currentDb.data} coins\n`);
        };
        message.channel.send(economyEmbed);
    }

    // Messages Leaderboard
    else if (xpAliases.includes(args[0].toLowerCase())) {
        const xpEmbed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`Messages Leaderboard`)
            .setFooter(message.author.tag, message.author.avatarURL({ dynamic: true }));

        var data = fetchDB(`messages_${message.guild.id}`);
        if (args[1])
            if (args[1].toLowerCase() === `global` || args[1].toLowerCase() === `all`) {
                data = fetchDB(`messages_`);
                xpEmbed.setTitle(`Global ${xpEmbed.title}`);
            };
        data.sort((a, b) => (db.get(a.ID).count < db.get(b.ID).count) ? 1 : -1);

        for (let i = 0; i < 10; i++) {
            const currentDb = data[i];
            if (!currentDb) break;
            xpEmbed.setDescription(`${xpEmbed.description || ``}${i + 1}. **${(bot.users.cache.get(currentDb.ID.split(`_`)[2]) || {tag: "Unknown User"}).tag}** - ${db.get(currentDb.ID).count} messages\n`);
        };
        message.channel.send(xpEmbed);
    };
};