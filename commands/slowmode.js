exports.config = {
    name: "slowmode",
    aliases: ["cooldown", "slowmo"],
    cooldown: 3,
    guildOnly: true,
    staffOnly: false,
    description: "Sets the required amount of seconds as slowmode in the requested channel.",
    usage: "slowmode [Channel] <Time>",
    category: "Management",
    permissions: ["MANAGE_CHANNEL"],
};

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    require(`../modules/checkPermission.js`)(message.member, this.config.permissions).then(async hasPerm => {
        if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
        var reason = args.join(` `)
        var channel = message.channel
        if (!args[0]) return message.channel.send(`🚫 | Please specify the time!`);
        var timeData = require(`../modules/timePrefixToMs.js`)(args[0]);
        var mentionedChannel = message.mentions.channels.first()
        if (mentionedChannel && args[0] === `<#${mentionedChannel.id}>`) {
            channel = message.mentions.channels.first()
            reason = args.slice(1).join(` `)
            timeData = require(`../modules/timePrefixToMs.js`)(args[1]);
        }
        if (!timeData) return message.channel.send(`🚫 | That's not a valid time format!`);
        var timeFormat;
        var time = timeData.time
        var format =  timeData.format
        if (format === `milliseconds`) timeFormat = time;
        else if (format === `seconds`) timeFormat = Math.round(time / 1000);
        else if (format === `minutes`) timeFormat = Math.round(time / 60 / 1000);
        else if (format === `hours`) timeFormat = Math.round(time / 60 / 60 / 1000);
        channel.setRateLimitPerUser(parseInt(time / 1000), reason)
        message.channel.send(new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`Slowmode changed!`)
            .setDescription(`Set <#${channel.id}>'s slowmode to ${timeFormat} ${format}!`)    
        )
    })
}