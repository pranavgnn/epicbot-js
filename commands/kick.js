exports.config = {
    name: "kick",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Kicks the specfied user on behalf of you.",
    usage: "kick <User> [Reason]",
    category: "Moderation",
    permissions: ["KICK_MEMBERS"],
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission(['KICK_MEMBERS'])) return message.channel.send(`🚫 | I do not have permissions to kick members!`)
    var reason = args.slice(1).join(' ') || `No reason specified`
    var kickEmbed = new MessageEmbed()
        .setTitle(`You have been kicked from ${message.guild.name}`)
        .setDescription(`**Moderator**: ${message.author} (${message.author.tag})\n**Reason**: ${reason}`)
        .setColor(`#ffff00`)
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        if (!args[0]) return message.channel.send(`🚫 | You need to specify a member on whom to take action upon!`)
        var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`)
        db.delete(`infractions_${message.guild.id}_${message.author.id}`)
        await user.send(kickEmbed).catch(() => message.channel.send(`Can not direct message this user.`))
        await user.kick(reason).catch(() => {
            kickEmbed.setTitle(`Failed to kick ${user.user.tag}`)
            kickEmbed.setDescription(`I could not kick ${user.user.username} because they are above me in role hierarchy.`)
            return message.channel.send(kickEmbed)
        })
        kickEmbed.setTitle(`${user.user.username} has been kicked from the server.`)
        message.channel.send(kickEmbed)
    })
}