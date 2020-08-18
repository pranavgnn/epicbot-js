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

const places = {
    "Discord": {
        max: 50,
        message: "Imagine losing some fresh cash in an application."
    },
    "Backyard": {
        max: 30,
        message: "I think your dog dropped your money in the backyard."
    },
    "Mom's Purse": {
        max: 60,
        message: "Did your mom borrow some cash from you the other day?"
    },
    "Dad's Shoe": {
        max: 60,
        message: "Your dad probably wore your money and went to work yesterday."
    },
    "Rooftop": {
        max: 75,
        message: "Cats can do anything, like taking your money to the rooftop."
    },
    "Electric Pole": {
        max: 100,
        message: "Lightning strikes, your money teleports!"
    },
    "Doghouse": {
        max: 20,
        message: "I wonder who took it there."
    },
    "Bill's House Without Gate": {
        max: 200,
        message: "You probably dropped your cash in his house the other day when you forgot to close the gate."
    },
}

exports.run = async (bot, message, args) => {
    
}