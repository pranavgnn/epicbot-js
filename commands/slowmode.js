exports.config = {
    name: "slowmode",
    aliases: ["cooldown", "slowmo"],
    cooldown: 3,
    guildOnly: true,
    staffOnly: false,
    description: "Sets the required amount of seconds as slowmode in the requested channel.",
    usage: "slowmode [Channel]",
    category: "Management",
};

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var reason = args.join(` `)
    var channel = message.channel
    var time = args[0]
    if (!time) return message.channel.send(`🚫 | Please enter the time in seconds of the slowmode!`)
    if (parseInt(time) < 0) return message.channel.send(`🚫 | You can not set cooldown of less than 0 seconds!`)
    var mentionedChannel = message.mentions.channels.first()
    if (mentionedChannel && args[0] === `<#${mentionedChannel.id}>`) {
        channel = message.mentions.channels.first()
        reason = args.slice(1).join(` `)
        time = args[1]
    }
    channel.setRateLimitPerUser(parseInt(time), reason)
    message.channel.send(new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Slowmode changed!`)
        .setDescription(`Set #${channel.name}'s slowmode to ${time} seconds!`)    
    )
}