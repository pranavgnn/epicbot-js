exports.config = {
    name: "setpresence",
    aliases: ["setactivity", "setmode", "setstatus", "mode", "status", "activity", "presence"],
    cooldown: 5,
    guildOnly: false,
    staffOnly: true,
    description: "Changes the bot's status to the specified status",
    usage: "setpresence [Status] [Type] <Activity>",
    category: "Staff Only",
};

var presences = [`PLAYING`, `WATCHING`, `LISTENING`, `STREAMING`]
var modes = [`online`, `idle`, `invisible`, `dnd`]

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var status = args[0].toLowerCase()
    var type = args[1]
    if (type) type = type.toUpperCase()
    var activity = args.slice(2).join(` `)
    if (!modes.includes(status) && !presences.includes(type)) {
        status = modes[0]
        type = presences[0]
        activity = args.join(` `)
    }
    if (presences.includes(args[0].toUpperCase())) {
        status = modes[0]
        type = args[0].toUpperCase()
        activity = args.slice(1).join(` `)
    } else if (modes.includes(status) && !presences.includes(type)) {
        type = presences[0]
        activity = args.slice(1).join(` `)
    }
    bot.user.setStatus(status).then(() => {
        bot.user.setPresence({ activity: { name: activity, type: type, url: `https://twitch.tv/pranvexploder` } }).then(() => {
            message.channel.send(new MessageEmbed()
                .setTitle(`Changed the presence!`)
                .setColor(`#00ff00`)
                .setDescription(`Status changed by ${message.author.tag}`)
                .addField(`Activity`, activity, true)
                .addField(`Mode`, status, true)
                .addField(`Type`, type, true)
            )
        })
    })
}