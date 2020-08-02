exports.config = {
    name: "suggest",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Sends your suggestions to the bot's staff's and owner's direct messages.",
    usage: "suggest <Suggestion>",
    category: "Miscellaneous",
};

const { MessageEmbed } = require(`discord.js`)
const db = require(`quick.db`)
const {
    OWNER,
    STAFF
} = require(`../config.json`)

exports.run = async (bot, message, args) => {
    function sendMsgToUser(id) {
        bot.users.cache.find(m => m.id === id).send(suggestionEmbed).catch(() => {})
    }
    if (!args[0]) return message.channel.send(`🚫 | Please specify the suggestion.`);
    if (OWNER === message.author.id || STAFF.includes(message.author.id)) {
        var tag = args[1]
        if (!tag) return message.channel.send(`🚫 | Admin and Staff can not suggest features.`)
        if (tag.startsWith(`#`)) tag = tag.slice(1)
        if (!args[1] || isNaN(tag)) return message.channel.send(`🚫 | That is not a valid tag.`)
        var suggestion = await db.fetch(`suggestion_${tag}`)
        var reason = args.slice(2).join(` `)
        db.delete(`suggestion_${tag}`)
        var suggestionEmbed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setDescription(`Suggestion with the tag \` #${tag} \` submitted by ${suggestion[0].submitter.tag} has been`)
            .setTitle(`Suggestion #${tag} has been`)
        var dmEmbed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`Your suggestion has been`)
            .setDescription(`: ${message.author} (${message.author.tag})\n**Reason**: ${reason || `Not specified`}`)
        if (args[0].toLowerCase() === 'accept') {
            suggestionEmbed.setDescription(suggestionEmbed.description + ` accepted.`)
            suggestionEmbed.setTitle(suggestionEmbed.title + ` accepted.`)
            dmEmbed.setTitle(dmEmbed.title + ` accepted!`)
            dmEmbed.setDescription(`**Accepter**` + dmEmbed.description)
            message.channel.send(suggestionEmbed)
            return bot.users.cache.find(m => m.id === suggestion[0].submitter.id).send(dmEmbed)
        } else if (args[0].toLowerCase() === `decline`) {
            suggestionEmbed.setDescription(suggestionEmbed.description + ` declined.`)
            suggestionEmbed.setTitle(suggestionEmbed.title + ` declined.`)
            dmEmbed.setTitle(dmEmbed.title + ` declined!`)
            dmEmbed.setDescription(`**Decliner**` + dmEmbed.description)
            message.channel.send(suggestionEmbed)
            sendMsgToUser(suggestion[0].submitter.id)
            sendMsgToUser(OWNER)
            for (let currentStaff of STAFF) sendMsgToUser(currentStaff)
            return
        }
    }
    db.add(`tags_suggestions`, 1)
    var suggestion = args.join(` `)
    var suggestionEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Suggestion #${db.fetch(`tags_suggestions`)} | ${message.author.tag}`)
        .setDescription(suggestion)
    sendMsgToUser(OWNER)
    for (let currentStaff of STAFF) sendMsgToUser(currentStaff)
    message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setDescription(`Your suggestion has been dropped in the owner's and all the staff's direct messages.\nSuggestion tag: \` #${db.fetch(`tags_suggestions`)} \``).setTitle(`Suggestion sent!`))
    db.push(`suggestion_${db.fetch(`tags_suggestions`)}`, {
        submitter: message.author,
        suggestion: suggestion,
    })
}