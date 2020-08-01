exports.config = {
    name: "unban",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Unbans the specified user from the server.",
    usage: "unban <User Id>",
    category: "Moderation",
    permissions: ["BAN_MEMBERS"],
};

const { MessageEmbed } = require("discord.js");

exports.run = async(bot, message, args) => {
    var unbanEmbed = new MessageEmbed()
        .setTitle(`Unban successful`)
        .setDescription(`Successfully unbanned`)
        .setColor(`#00ff00`)
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        var user = args[0]
        if (!user) return message.channel.send(`🚫 | Please specify an user id!`)
        if (user.toLowerCase() === `all`) {
            message.guild.fetchBans().then(bans => {
                if (bans.size == 0) {
                    unbanEmbed.setTitle(`Unban failed`)
                    unbanEmbed.setDescription(`There are no banned users in this server to unban!`)
                    unbanEmbed.setColor(`#ffff00`)
                    return message.channel.send(unbanEmbed)
                }
                bans.forEach(ban => {
                    message.guild.members.unban(ban.user.id);
                });
                unbanEmbed.setDescription(unbanEmbed.description + ` all members.`)
                message.channel.send(unbanEmbed)
            })
        } else if (parseInt(user)) {
            message.guild.members.unban(user).then(user => {
                unbanEmbed.setDescription(unbanEmbed.description + ` ${user.tag}`)
                message.channel.send(unbanEmbed)
            }).catch(() => {
                unbanEmbed.setTitle(`Unban failed`)
                unbanEmbed.setDescription(`No banned id "${args[0]}" was found in the bans of this server.`)
                unbanEmbed.setColor(`#ffff00`)
                return message.channel.send(unbanEmbed)
            })
        }

    })
}
