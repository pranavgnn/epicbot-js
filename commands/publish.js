exports.config = {
    name: "publish",
    cooldown: 5,
    guildOnly: false,
    staffOnly: true,
    description: "Publishes an update, which will be dropped in the subscribers' direct messages.",
    usage: "publish <Update>",
    category: "Staff Only",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | You need to specify what's the update!`)
    var updatesEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`New update! 🥳 🎉`)
        .addField(`Update`, args.join(` `))
        .addField(`Publisher`, message.author.tag)
        .addField(`Don't want to receive updates?`, `Type \`$updates\` here or in any server where I am in.`)
        .setTimestamp(message.createdTimestamp)
    var allDb = db.all()
    var updates = []
    if (allDb) allDb.forEach(currentDb => {
        if (currentDb.ID.startsWith(`updates_`) && currentDb.data === `true`) {
            updates.push(currentDb) 
        }
    })
    updates.forEach(currentDb => {
        var id = currentDb.ID.split(`_`)[1]
        var user = bot.users.cache.get(id)
        if (user) user.send(updatesEmbed).catch(() => {})
    })
    message.channel.send(`Successfully sent the update!`, updatesEmbed)
}