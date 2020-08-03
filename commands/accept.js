exports.config = {
    name: "accept",
    aliases: ["approve"],
    cooldown: 5,
    guildOnly: true,
    staffOnly: true,
    description: "Accepts the suggestion / bug report that was reported and is active in the #suggestions channel of the support server.",
    usage: "accept <\"Suggestion\" / \"Report\"> <Tag> [Reason]",
    category: "Staff Only",
};

const db = require(`quick.db`);
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, message, args) => {
    var supportGuild = bot.guilds.cache.find(g => g.id === `719558358776152065`)
    if (!args[0]) return message.channel.send(`🚫 | Please specify a type. (Suggestion / Report)`)
    if (!args[1]) return message.channel.send(`🚫 | Please specify the suggestion/report tag.`)
    var type = args[0].toLowerCase()
    var tag = args[1]
    var reason = args.slice(2).join(` `) || `No reason specified.`
    if (tag.startsWith(`#`)) args = args.slice(1)
    if (isNaN(tag)) return message.channel.send(`🚫 | That is not a valid tag.`)
    if (type === `suggestion`) {
        var suggestionData = await db.fetch(`suggestion_db`)
        var suggestionTag = await db.fetch(`tag_suggestion`)
        if (!suggestionData || !suggestionData[0]) return message.channel.send(`🚫 | There are currently no active suggestions.`)
        if (tag > suggestionTag || tag < 0) return message.channel.send(`🚫 | That is not a valid tag.`)
        var chosenSuggestion = suggestionData[parseInt(tag) - 1]
        var newData = []
        for (let suggestion of suggestionData) if (suggestion !== chosenSuggestion) newData.push(suggestion)
        await db.set(`suggestion_db`, newData)
        var fetchedMsgs = await supportGuild.channels.cache.find(c => c.id === `739464942746468393`).messages.fetch(chosenSuggestion.msg.id)
        fetchedMsgs.delete()
        var acceptEmbed = new MessageEmbed()
            .setColor(`#00ff00`)
            .setTitle(`Suggestion accepted!`)
            .setDescription(`Your suggestion has been accepted!`)
            .addField(`Suggestion #${tag}`, chosenSuggestion.suggestion)
            .addField(`Accepted staff`, `${message.author.tag} (${message.author.id})`)
            .addField(`Reason`, reason)
            .setTimestamp(message.createdTimestamp)
        await bot.users.cache.find(u => u.id === chosenSuggestion.submitter.id).send(acceptEmbed).catch(() => {})
        acceptEmbed.setDescription(`Suggestion #${tag} has been accepted`)
        acceptEmbed.addField(`Suggested by`, `${chosenSuggestion.submitter.tag} (${chosenSuggestion.submitter.id})`)
        supportGuild.channels.cache.find(c => c.id === `739484770404270142`).send(acceptEmbed)
    } else return message.channel.send(`🚫 | That type is invalid. Choose any of these: \`Suggestion\`, \`Report\``)
}