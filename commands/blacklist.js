exports.config = {
    name: "blacklist",
    cooldown: 5,
    guildOnly: false,
    staffOnly: true,
    description: "Blacklists the specified user or the guild from using the bot",
    usage: "blacklist <\"Add\" / \"Remove\"> <User Id / Guild Id>",
    category: "Staff Only",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var process = args[0].toLowerCase()
    if (process !== 'add' && process !== 'remove') return message.channel.send(`🚫 | Please specify the process (Add / Remove).`)
    var id = args[1]
    if (isNaN(parseInt(id))) return message.channel.send(`🚫 | That is not a valid user / guild id!`)
    var target = bot.guilds.cache.find(g => g.id === id) || bot.users.cache.find(u => u.id === id)
    if (!target) return message.channel.send(`🚫 | No such user / guild with the id "${id}" was found.`)
    if (target.username) target.type = `User`
    else target.type = `Guild`
    var reason = args.slice(2).join(` `) || `No reason specified.`
    if (process === `add`) {
        if (db.fetch(`blacklist_${id}`)) return message.channel.send(`🚫 | ${target.type} with id "${id}" is already blacklisted!`)
        db.push(`blacklist_${id}`, {
            moderator: message.author,
            reason: reason,
            time: message.createdTimestamp
        })
        message.channel.send(new MessageEmbed()
            .setColor(`#ff0000`)
            .setTitle(`Blacklist successful`)
            .setDescription(`${target.type} with the id "${id}" has successfully been blacklisted! The member(s) can no more use commands of the bot.\nReason for blacklist:\`\`\`${reason}\`\`\``)
        )
    } else {
        db.delete(`blacklist_${id}`)
        message.channel.send(new MessageEmbed()
            .setColor(`#00ff00`)
            .setTitle(`Blacklist removal successful`)
            .setDescription(`${target.type} with the id "${id}" has successfully been removed from the blacklist! The member(s) can now use commands of the bot.\nReason for removal of blacklist:\`\`\`${reason}\`\`\``)
        )
    }
}