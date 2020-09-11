exports.config = {
    name: "addemoji",
    cooldown: 3,
    guildOnly: true,
    staffOnly: false,
    description: "Uploads the specified emoji attachment / URL with the given name to the server.",
    usage: "addemoji <Name> [URL]",
    category: "Management",
    permissions: ["MANAGE_EMOJIS"],
};

const { MessageEmbed } = require(`discord.js`);

exports.run = async (bot, message, args) => {
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`));
        if (!args[0]) return message.channel.send(`🚫 | Please enter an emoji name!`);
        if (args[0].startsWith('http')) return message.channel.send(`🚫 | Emoji names must be specified before emoji URL.`)
        var url = args[1];
        if(message.attachments.first()){
            url = message.attachments.first().url;
        }
        if (!url) return message.channel.send(`🚫 | Please enter the emoji as an attachment or a URL.`)
        message.guild.emojis.create(url, args[0])
            .then(emoji => {
                message.channel.send(`Successfully created ${emoji} with the name **\\:${emoji.name}:**!`);
            })
            .catch(() => message.channel.send(`There was an error while adding the emoji. Please try again.`));
    })
}