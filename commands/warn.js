exports.config = {
    name: "warn",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Warns a specified user for a specific reason and pushes the warn to the infractions list of the user.",
    usage: "warn <User> <Reason>",
    category: "Moderation",
    permissions: ["MANAGE_CHANNELS"],
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    //if (!bot.user.hasPermission(['KICK_MEMBERS'])) return message.channel.send(`🚫 | I do not have permissions to kick members!`)
    var reason = args.slice(1).join(' ')
    var warnEmbed = new MessageEmbed()
        .setTitle(`You have been warned in ${message.guild.name}`)
        .setDescription(`**Moderator**: ${message.author} (${message.author.tag})\n**Reason**: ${reason}`)
        .setColor(`#ffff00`)
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        if (!args[0]) return message.channel.send(`🚫 | You need to specify a member on whom to take action upon!`)
        if (!args[1]) return message.channel.send(`🚫 | You need to specify a a reason!`)
        var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`)
        db.push(`infractions_${message.guild.id}_${message.author.id}`, 
        {
            reason: reason,
            warnee: message.author,
            time: message.createdTimestamp,
            target: user.user
        })
        await user.send(warnEmbed).catch(() => message.channel.send(`Can not direct message this user.`))
        warnEmbed.setTitle(`${user.user.username} has been successfully warned.`)
        message.channel.send(warnEmbed)
    })
}