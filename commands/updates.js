exports.config = {
    name: "updates",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Subscribes you to recieve the future update notes in your Direct Messages.",
    usage: "updates",
    category: "Miscellaneous",
};

const db = require(`quick.db`)

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var currentSetting = await db.fetch(`updates_${message.author.id}`) || false
    await db.set(`updates_${message.author.id}`, !currentSetting)
    var updatesEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Successfully changed the update settings!`)
    if(!currentSetting === true) updatesEmbed.setDescription(`You will now recieve a direct message with the update logs whenever the bot is updated! However, make sure you have the bot unblocked and you let any one server's direct messages open so the bot can send you a message.`)
    else updatesEmbed.setDescription(`You will not recieve any direct message from the bot regarding changelogs.`)
    message.channel.send(updatesEmbed)
}