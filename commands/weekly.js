exports.config = {
    name: "weekly",
    cooldown: 604800,
    guildOnly: false,
    description: "Places 10000 coins in your wallet. Can be used only once a week.",
    usage: "weekly",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    message.channel.send(new MessageEmbed().setColor(`#eb98ff`).setTitle(`Here, 10000 coins were placed in your wallet.`).setDescription(`Your current balance: \`\`\`${db.fetch(`cash_${message.author.id}`) + 10000} coins\`\`\``))
    db.add(`cash_${message.author.id}`, 10000)
}