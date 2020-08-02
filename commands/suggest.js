exports.config = {
    name: "suggest",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Sends your your suggestion to the #suggestions channel of the support server. Misuse of the command will result in blacklist.",
    usage: "suggest <Suggestion>",
    category: "Miscellaneous",
};

const { MessageEmbed } = require(`discord.js`)
const db = require(`quick.db`)

exports.run = async (bot, message, args) => {
    var supportGuild = bot.guilds.cache.find(g => g.id === `719558358776152065`)
    if (!args[0]) return message.channel.send(`🚫 | Please suggest something!`)
    var suggestion = args.join(` `)
    var suggestionData = db.fetch(`suggestion_db`) || []
    var tag = await db.fetch(`tag_suggestion`) || 0
    var suggestionEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Suggestion #${tag}`)
        .setDescription(`A new suggestion!`)
        .addField(`Suggestion`, suggestion)
        .addField(`Suggested from`, `${message.guild.name} (${message.guild.id})`)
        .addField(`Suggested by`, `${message.author.tag} (${message.author.id})`)
        .addField(`Tag`, `#${tag}`)
        .setTimestamp(message.createdTimestamp)
    supportGuild.channels.cache.find(c => c.id === `739484770404270142`).send(suggestionEmbed)
    var suggestionMsg = await supportGuild.channels.cache.find(c => c.id === `739464942746468393`).send(suggestionEmbed)
    suggestionMsg.react(`⬆️`).then(() => suggestionMsg.react(`⬇️`))
    var data = {
        suggestion: suggestion,
        submitter: message.author,
        tag: tag,
        time: message.createdTimestamp,
        msg: suggestionMsg,
    }
    suggestionData.push(data)
    await db.set(`suggestion_db`, suggestionData)
    message.channel.send(new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Suggestion sent`)
        .setDescription(`Your suggestion was assigned a tag (#${tag}) and was dropped in the #suggestions channel of the support server. If the suggestion gets enough upvotes, we will implement it!`)
    )
    db.add(`tag_suggestion`, 1)
}