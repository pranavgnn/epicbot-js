exports.config = {
    name: "daily",
    cooldown: 86400,
    guildOnly: false,
    staffOnly: false,
    description: "Places 1000 coins in your wallet. Can be used only once a day.",
    usage: "daily",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Here, 1000 coins were placed in your wallet.`).setDescription(`Your current balance: \`\`\`${db.fetch(`cash_${message.author.id}`) + 1000} coins\`\`\``))
    db.add(`cash_${message.author.id}`, 1000)
}