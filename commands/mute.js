exports.config = {
    name: "mute",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Mutes a specified user from the server.",
    usage: "mute <User> [Reason]",
    category: "Moderation",
    permissions: ["MANAGE_ROLES"],
};

const { MessageEmbed } = require(`discord.js`);

exports.run = async (bot, message, args) => {
    if (!message.guild.me.hasPermission(this.config.permissions)) return message.channel.send(`🚫 | I do not have permissions to mute members!`);
    async function createMuteRole() {
        await message.guild.roles.create({ data: { name: 'Muted', color: '#000001' } }).then(role => {
            message.guild.channels.cache.forEach(async channel => {
                await channel.updateOverwrite(role, { SEND_MESSAGES: false });
            });
            return role;
        })
    };

    var reason = args.slice(1).join(' ') || `No reason specified`;

    var muteEmbed = new MessageEmbed()
        .setTitle(`You have been muted from ${message.guild.name}`)
        .setDescription(`**Moderator**: ${message.author} (${message.author.tag})\n**Reason**: ${reason}`)
        .setColor(`#ffff00`)

    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`));

        var role = message.guild.roles.cache.find(r => r.name.toLowerCase() === `muted`) || await createMuteRole();
        if (!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase() === `muted`);

        if (!args[0]) return message.channel.send(`🚫 | You need to specify a member on whom to take action upon!`);
        var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild);
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`);

        await user.send(muteEmbed).catch(() => muteEmbed.setDescription(`${muteEmbed.description}\n\nI couldn't direct message this user.`))

        user.roles.add(role).then(() => {
            muteEmbed.setTitle(`${user.user.username} has been muted from the server.`)
            message.channel.send(muteEmbed)
        }).catch(() => {})
    });
};