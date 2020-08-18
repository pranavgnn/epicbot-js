exports.config = {
    name: "say",
    aliases: ["rep", "tell", "speak"],
    cooldown: 10,
    guildOnly: true,
    staffOnly: false,
    description: "Says a message or embed on behalf of you.",
    usage: "say <Message / Embed>",
    category: "Management",
    permissions: ["MANAGE_MESSAGES", "MENTION_EVERYONE"]
};

const { MessageEmbed } = require(`discord.js`)

exports.run = async (_, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please specify the message!`)
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(hasPerm => {
        if (typeof hasPerm === 'string') {
            return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        }
        message.delete()
        var cont = args.join(' ');
        if (args[0].startsWith('{"embed":')) cont = JSON.parse(args.join(' ').replace(/'/g, "\""));
        message.channel.send(cont);
    })
};