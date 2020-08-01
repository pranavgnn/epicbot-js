exports.config = {
    name: "beg",
    cooldown: 90,
    guildOnly: false,
    staffOnly: false,
    description: "Places a random amount of coins in your wallet.",
    usage: "beg",
    category: "Economy",
};

const db = require(`quick.db`)
const fetch = require(`node-fetch`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var randomCoins = Math.floor(Math.random() * 125)
    var begEmbed = new MessageEmbed().setColor(`#eb98ff`).setTitle(`You beg, you beg and you beg and finally`)
    fetch(`http://names.drycodes.com/1?nameOptions=${[`girl`, `boy`][Math.floor(Math.random() * 2)]}_names&separator=space`)
        .then(res => res.json())
        .then(json => {
            begEmbed.setDescription(`${json[0]} donates you ${randomCoins} coins! Your balance: \`\`\`${db.fetch(`cash_${message.author.id}`) || 0 + randomCoins} coins\`\`\``)
            message.channel.send(begEmbed)
        })
    db.add(`cash_${message.author.id}`, randomCoins)
}