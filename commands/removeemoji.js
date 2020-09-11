exports.config = {
    name: "removeemoji",
    aliases: ["deleteemoji", "remove-emoji", "delete-emoji"],
    cooldown: 3,
    guildOnly: true,
    staffOnly: false,
    description: "Uploads the specified emoji attachment / URL with the given name to the server.",
    usage: "removeemoji <Name> [Reason]",
    category: "Management",
    permissions: ["MANAGE_EMOJIS"],
};

const { MessageEmbed } = require(`discord.js`);

exports.run = async (bot, message, args) => {
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`));
        if (!args[0]) return message.channel.send(`🚫 | Please enter an emoji that has to be deleted!`);
        const emoji = message.guild.emojis.cache.find(e => e.name === args[0]) ||
                      message.guild.emojis.cache.find(e => e.name === args[0].split(`:`)[1]);
        if (!emoji) return message.channel.send(`🚫 | That emoji doesn't exist in this server.`);
        emoji.delete(args.slice(1).join(` `))
            .then(emoji => {
                message.channel.send(`Successfully deleted the emoji with the name **${emoji}**!`);
            })
            .catch(() => message.channel.send(`There was an error while deleting the emoji. Please try again.`));
    });
};