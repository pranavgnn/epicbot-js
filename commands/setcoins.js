exports.config = {
    name: "setcoins",
    aliases: ["setcash", "overwritecoins", "setmoney"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: true,
    description: "Overwrites your or the specified user's database and sets the specified amount of coins.",
    usage: "setcoins [User] <Amount>",
    category: "Staff Only",
};

const db = require(`quick.db`)

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please specify an amount to change your coins to.`)
    var user = message.author
    var amount = parseInt(args[0])
    var reason = args.slice(1).join(` `) || `No reason specified`
    if (isNaN(amount)) {
        user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | That user wasn't found in this server.`)
        user = user.user
        if (!args[1]) return message.channel.send(`🚫 | Please specify an amount to change ${user.username}'s coins to.`)
        amount = parseInt(args[1])
        reason = args.slice(2).join(` `) || `No reason specified`
    }
    if (isNaN(amount)) return message.channel.send(`🚫 | The amount of coins that you specified isn't an integer.`)
    await db.delete(`cash_${user.id}`)
    await db.add(`cash_${user.id}`, amount)
    var embed = new MessageEmbed()
        .setColor(`#00ff00`)
        .setTitle(`Coins successfully set`)
        .setDescription(`Successfully set ${user.tag}'s coins to ${amount}. Reason:\`\`\`${reason}\`\`\``)
    message.channel.send(embed)
    embed.setTitle(`Your coins were changed`)
    embed.setDescription(`Bot staff ${message.author} (${message.author.tag}) changed your coins to ${amount} for the reason:\`\`\`${reason}\`\`\``)
    user.send(embed).catch()
}