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

const db = require(`quick.db`)
const fetch = require(`node-fetch`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var serverTop = []
    var allTop = []
    var resp = db.all();
    resp.sort((a, b) => (a.data < b.data) ? 1 : -1);

    for (let key of resp) {
        if (key.ID.startsWith(`cash_`)) {
            var user = require(`../modules/getUserFromMention.js`)(key.ID.split(`_`)[1], message.guild)
            var notGuildUser
            if (user) {
                key.user = user.user
                if (!serverTop.includes(key)) serverTop.push(key)
            } else {
                notGuildUser = bot.users.cache.find(m => m.id === key.ID.split(`_`)[1])
                key.user = notGuildUser.user
            }
            if (!allTop.includes(key)) allTop.push(key)
        }
    }
    var topEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setDescription(`Type $help economy for help with currency system.`)
   if (!args[0]) {
        for (let i = 0; i < 3; i++) {
            var iterate = serverTop[i]
            if (!iterate) break
            topEmbed.addField(`#${i + 1} - ${iterate.user.tag}`, `${db.fetch(`cash_${iterate.user.id}`)} coins`)
        }
        topEmbed.setTitle(`Leaderboards for ${message.guild.name}`)
        message.channel.send(topEmbed)
   } else if (args[0].toLowerCase() === `global`|| args[0].toLowerCase() === `all`) {
    for (let i = 0; i < 25; i++) {
        var iterate = allTop[i]
        if (!iterate) break
        if (iterate.data > 0) topEmbed.addField(`#${i + 1} - ${iterate.user.tag}`, `${db.fetch(`cash_${iterate.user.id}`)} coins`)
    }
    topEmbed.setTitle(`Global leaderboards`)
    message.channel.send(topEmbed)
   }
}