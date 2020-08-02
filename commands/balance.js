exports.config = {
    name: "balance",
    aliases: ["bal", "cash", "coins", "money"],
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Displays your / specified user's balance.",
    usage: "balance [User]",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var user = message.author;
    if (args[0]) {
        if (args[0].toLowerCase() === 'cops') return message.channel.send(
            new MessageEmbed()
                .setColor(`eb98ff`)
                .setTitle(`Balance of the cops`)
                .setDescription(`\`\`\`${db.fetch(`fines_cash`) || 0} coins\`\`\``).setFooter(`They of course are rich because they have fined so many discord users.`)
        )
        user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | That user wasn't found in this server.`)
        user = user.user
    }
    var balEmbed = new MessageEmbed()
        .setTitle(`Balance of ${user.tag}`)
        .setDescription(`Fetching balance...`)
        .setColor(`#eb98ff`)
    var msg = await message.channel.send(balEmbed)
    var cash = await db.fetch(`cash_${user.id}`)
    if (cash === null) cash = 0
    setTimeout(() => msg.edit(balEmbed.setDescription(`\`\`\`${cash} coins\`\`\``)), 500)
}