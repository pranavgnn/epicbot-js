exports.config = {
    name: "rob",
    aliases: ["steal", "theft"],
    cooldown: 180,
    guildOnly: false,
    staffOnly: false,
    description: "Tries to steal money from the specified user's wallet.",
    usage: "rob <User>",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

var possiblities = [false, false, false, true]

exports.run = async (bot, message, args) => {
    var authorCash = await db.fetch(`cash_${message.author.id}`)
    if (authorCash < 500) return message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Robbery failed!`).setDescription(`You need to have a minimum of 500 coins in your wallet to perform a robbery!`))
    var result = possiblities[Math.floor(Math.random() * possiblities.length)]
    if (!args[0]) return message.channel.send(`🚫 | You need to specify an user.`)
    var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
    if (!user) return message.channel.send(`🚫 | That user doesn't exist in this server.`)
    if (user.user === message.author) return message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Robbery failed!`).setDescription(`Trying to pick your own wallet? That is illegal... I guess?`))
    var userCash = await db.fetch(`cash_${user.user.id}`)
    if (userCash < 1000) return message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Robbery failed!`).setDescription(`The target user needs to have a minimum of 1000 coins in their wallet to rob!`))
    if (result === false) {
        var fineCash = Math.floor(Math.random() * (authorCash / 10))
        message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Robbery failed!`).setDescription(`You were about to pick **${user.user.username}**'s pocket, when the cops caught you red-handed! You were fined **${fineCash} coins**!`))
        db.subtract(`cash_${message.author.id}`, fineCash)
        db.add(`fines_cash`, fineCash)
    }
    else {
        var stolenCash = Math.floor(Math.random() * (userCash / 2))
        message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Robbery successful!`).setDescription(`You put you hands on **${user.user.username}**'s wallet, and you got some fresh **${stolenCash} coins**! Your balance: \`\`\`${authorCash + stolenCash} coins\`\`\``))
        db.add(`cash_${message.author.id}`, stolenCash)
        db.subtract(`cash_${user.user.id}`, stolenCash)
    }
}