exports.config = {
    name: "search",
    aliases: ["level"],
    cooldown: 300,
    guildOnly: true,
    staffOnly: false,
    description: "Displays your / specified user's XP and rank in the server.",
    usage: "rank [User]",
    category: "Economy",
};

const db = require(`quick.db`)
const { MessageEmbed } = require(`discord.js`)

const places = ["Discord", "Backyard", "Mom's Purse", "Dad's Phoe", "Rooftop", "Electric Pole", "Doghouse", "Bill's House Without Gate"]

exports.run = async (bot, message, args) => {
    
}