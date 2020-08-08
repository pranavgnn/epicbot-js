exports.config = {
    name: "infractions",
    aliases: ["warns", "warnings", "crimes", "violations"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Displays the infractions of yours / specified user. Also used to remove infractions.",
    usage: "infractions [User] [Clearing tag / \"All\"]",
    category: "Moderation",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var infEmbed = new MessageEmbed() 
        .setColor(`#ff0000`)
        .setTitle(`Your infractions`)
    var user = message.member
    if (args[0]) {
        user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
        if (!user) return message.channel.send(`🚫 | I could not find that user in this server.`)
        infEmbed.setTitle(`${user.user.username}'s infractions`)
        user = user.user
    }
    var infractions = await db.fetch(`infractions_${message.guild.id}_${user.id}`)
    if (!infractions || infractions && !infractions[0]) {
        infEmbed.addField(`No infractions`, `${user.username || message.author.username} has no infractions.`)
    } else {
        infractions.forEach((data, i) => {
            var date = new Date(data.time).toUTCString()
            infEmbed.addField(`Infraction #${i + 1}`, `**Reason**: ${data.reason}\n**Moderator**: ${data.warnee.tag}\n**Time**: ${date}`)
        })
    }
    if (args[1]) {
        require(`../modules/checkPermission.js`)(user, ['MANAGE_MESSAGES']).then(async hasPerm => {
            if (typeof hasPerm === 'string') return message.channel.send(new MessageEmbed().setTitle(`You don't have permissions!`).setDescription(`This command requires the permissions:\`\`\`${hasPerm}\`\`\``).setColor(`#ff0000`))
            if (parseInt(args[1])) {
                var newInfractions = []
                var removedInfraction = {}
                if (infractions) infractions.forEach((data, i) => {
                    if ((parseInt(args[1]) - 1) !== i) newInfractions.push(data)
                    else {
                        removedInfraction.data = data
                        removedInfraction.id = i + 1
                    }
                })
                if (!removedInfraction.data) return message.channel.send(`🚫 | That isn't a valid tag!`)
                db.set(`infractions_${message.guild.id}_${user.id}`, newInfractions)
                var date = new Date(removedInfraction.data.time).toUTCString()
                if (removedInfraction) message.channel.send(new MessageEmbed()
                    .setTitle(`Successfully cleared infraction!`)
                    .setDescription(`**ID**: #${removedInfraction.id}\n**Target**: ${removedInfraction.data.target.tag}\n**Moderator**: ${removedInfraction.data.warnee.tag}\n**Reason**: ${removedInfraction.data.reason}\n**Time**: ${date}:`)
                    .setColor(`#00ff00`)
                )
            } else if (args[1].toLowerCase() === `all`) {
                db.delete(`infractions_${message.guild.id}_${user.id}`)
                message.channel.send(new MessageEmbed()
                    .setTitle(`Successfully cleared infractions!`)
                    .setDescription(`Successfully cleared all the infractions of ${user.tag}!`)
                    .setColor(`#00ff00`)
                )
            } else return message.channel.send(`🚫 | Please input an integer representing the tag or "all" representing to clear all infractions.`)
        })
    } else message.channel.send(infEmbed)
}