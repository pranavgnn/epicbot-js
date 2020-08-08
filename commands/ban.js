exports.config = {
    name: "ban",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Bans the specfied user on behalf of you.",
    usage: "ban <User> [Reason]",
    category: "Moderation",
    permissions: ["BAN_MEMBERS"],
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission(['BAN_MEMBERS'])) return message.channel.send(`🚫 | I do not have permissions to ban members!`)
    var reason = args.slice(1).join(' ') || `No reason specified`
    var banEmbed = new MessageEmbed()
        .setTitle(`You have been banned from ${message.guild.name}`)
        .setDescription(`**Moderator**: ${message.author} (${message.author.tag})\n**Reason**: ${reason}`)
        .setColor(`#ff0000`)
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        if (!args[0]) return message.channel.send(`🚫 | You need to specify a member on whom to take action upon!`)
        var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`)
        db.delete(`infractions_${message.guild.id}_${message.author.id}`)
        await user.send(banEmbed).catch(() => {})
        user.ban(reason).then(() => {
            banEmbed.setTitle(`${user.user.username} has been banned from the server.`)
            message.channel.send(banEmbed)
        }).catch(() => {
            banEmbed.setTitle(`Failed to ban ${user.user.tag}`)
            banEmbed.setDescription(`I could not ban ${user.user.username} because they are above me in role hierarchy.`)
            return message.channel.send(banEmbed)
        })
        
    })
}