exports.config = {
    name: "match",
    aliases: ["ship", "mergename", "usermerge"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Merges yours and the specified user's, or two specified users' usernames and mentions it to you.",
    usage: "match <User 1> [User 2]",
    category: "Games",
};

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | You need to mention a user!`)
    var userMention1 = message.author;
    var userMention2 = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
    if (args[1]) {
        userMention1 = userMention2
        userMention2 = require(`../modules/getUserFromMention.js`)(args[1], message.guild)
    }
    if (!userMention1 || !userMention2) return message.channel.send(`🚫 | That user wasn't found in this server.`)
    if (userMention1 !== message.author) userMention1 = userMention1.user
    userMention2 = userMention2.user
    var msg = await message.channel.send(`🎌 Matching... 🎌`)
    var user1 = userMention1.username.slice(0, Math.round(userMention1.username.length / 2))
    var user2 = userMention2.username.slice(Math.round(userMention2.username.length / 2), userMention2.username.length);
    setTimeout(() => {
        msg.edit(`**${userMention1.username} 💞 ${userMention2.username}** | Matched -  **${user1 + user2}**`)
    }, 2000);
};