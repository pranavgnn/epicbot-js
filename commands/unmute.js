exports.config = {
    name: "unmute",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Unmutes a specified muted user from the server.",
    usage: "unmute <User> [Reason]",
    category: "Moderation",
    permissions: ["MANAGE_ROLES"],
};

const { MessageEmbed } = require(`discord.js`);

exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission(this.config.permissions)) return message.channel.send(`🚫 | I do not have permissions to mute members!`);

    var reason = args.slice(1).join(' ') || `No reason specified`;

    var unmuteEmbed = new MessageEmbed()
        .setTitle(`You have been unmuted from ${message.guild.name}`)
        .setDescription(`**Moderator**: ${message.author} (${message.author.tag})\n**Reason**: ${reason}`)
        .setColor(`#00ff00`)

    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`));

        var role = message.guild.roles.cache.find(r => r.name.toLowerCase() === `muted`);
        if (!role) {
            unmuteEmbed.setTitle(`Unmute Failed`)
                .setDescription(`Whom do you expect me to unmute when this server doesn't have a "Muted" role at all?`)
                .setColor(`#ff0000`);
            return message.channel.send(unmuteEmbed);
        };

        if (!args[0]) return message.channel.send(`🚫 | You need to specify a member on whom to take action upon!`);
        var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild);
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`);

        if (!user.roles.cache.some(r => r === role)) {
            unmuteEmbed.setTitle(`Unmute Failed`)
                .setDescription(`This user is not muted from this server, so I can not unmute them.`)
                .setColor(`#ff0000`);
            return message.channel.send(unmuteEmbed);
        };

        await user.send(unmuteEmbed).catch(() => unmuteEmbed.setDescription(`${unmuteEmbed.description}\n\nI couldn't direct message this user.`))

        user.roles.remove(role).then(() => {
            unmuteEmbed.setTitle(`${user.user.username} has been unmuted from the server.`)
            message.channel.send(unmuteEmbed)
        }).catch(() => {})
    });
};