exports.config = {
    name: "mystats",
    aliases: ["mystatistics", "commandstats", "cmdstats"],
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Tells you some of your data regarding the specifed command.",
    usage: "mystats <Command>",
    category: "Miscellaneous",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var cmd = args.join(` `)
    if (!cmd) return message.channel.send(`🚫 | Please specify a command name whose stats you want to view.`)
    var requiredCmd = bot.commands.get(cmd) 
    if (!bot.commands.has(cmd)) return message.channel.send(`🚫 | No such command called "${cmd}" exists!`)
    cmd = cmd.toLowerCase()
    var data = await db.fetch(`cooldowns_${message.author.id}_${cmd}`) || {
        lastUsed: null,
        streak: 0,
        totalUse: 0,
        inCooldown: false
    }
    var cmdCooldown = (requiredCmd.config.cooldown || 3) * 1000
    if (data.inCooldown === undefined) {
        var delta = Math.round(Date.now() - data.lastUsed)
        if (delta > cmdCooldown) data.inCooldown = false
        else data.inCooldown = true
    }
    var statsEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Command stats`)
        .setDescription(`Your status on using the command: **${cmd}**`)
        .addField(`Currently in cooldown`, `\`\`\`${data.inCooldown}\`\`\``, true)
        .addField(`Usage streak`, `\`\`\`${data.streak}\`\`\``, true)
        .addField(`Total uses`, `\`\`\`${data.totalUse}\`\`\``, true)
        .setFooter(`Last used`)
        .setTimestamp(data.lastUsed)
    if (!data.lastUsed) statsEmbed.setFooter(`Last used  •  Not used`)
    message.channel.send(statsEmbed)
}