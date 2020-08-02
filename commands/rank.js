exports.config = {
    name: "rank",
    aliases: ["level"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Displays your / specified user's XP and rank in the server.",
    usage: "rank [User]",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var user = message.author;
    if (args[0]) {
        user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | That user wasn't found in this server.`)
        user = user.user
    }
    var data = await db.fetch(`messages_${message.guild.id}_${user.id}`)
    if (!data) data = {
        count: 0,
        target: 50,
        level: 0,
        reward: 250
    }
    // db.set(`messages_707271315844890696_583654590742790185`, {
    //     count: 0,
    //     target: 50,
    //     level: 0,
    //     reward: 250
    // })
    var rankmbed = new MessageEmbed()
        .setTitle(`Rank card of ${user.tag}`)
        .setDescription(`Fetching data...`)
        .setColor(`#eb98ff`)
    var msg = await message.channel.send(rankmbed)
    setTimeout(() => msg.edit(rankmbed.setDescription(`Level:\`\`\`Level ${data.level}\`\`\`Number of messages:\`\`\`${data.count} messages / ${data.target} messages\`\`\``)), 500)
}