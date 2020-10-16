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

const places = [
    {
        place: "Discord",
        max: 50,
        message: "Imagine losing some fresh cash in an application."
    },
    {
        place: "Backyard",
        max: 30,
        message: "I think your dog dropped your money in the backyard."
    },
    {
        place: "Mom's Purse",
        max: 60,
        message: "Did your mom borrow some cash from you the other day?"
    },
    {
        place: "Dad's Shoe",
        max: 60,
        message: "Your dad probably wore your money and went to work yesterday."
    },
    {
        place: "Rooftop",
        max: 75,
        message: "Cats can do anything, like taking your money to the rooftop."
    },
    {
        place: "Electric Pole",
        max: 100,
        message: "Lightning strikes, your money teleports!"
    },
    {
        place: "Doghouse",
        max: 20,
        message: "I wonder who took it there."
    },
    {
        place: "Bill's House Without Gate",
        max: 200,
        message: "You probably dropped your cash in his house the other day when you forgot to close the gate."
    },
];

exports.run = async (bot, message, args) => {
    const chosenPlaces = [];
    for (let i = 0; i < 4; i++) {
        function pushPlace() {
            var currentRandom = places[Math.floor(Math.random() * places.length)];
            if (!chosenPlaces.includes(currentRandom)) chosenPlaces.push(currentRandom);
            else pushPlace();
        };
        pushPlace();
    };

    const emojis = [``, ``, ``];
    const ops = {};

    const searchEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Choose a place`)

    for (let i = 0; i < chosenPlaces.length; i++) {
        searchEmbed.setDescription(`${searchEmbed.description}**${i + 1}.** ${chosenPlaces[i].place}\n`);
    };

    const msg = await message.channel.send(searchEmbed);
        
    emojis.forEach(async (emoji, i) => {
        await msg.react(emoji);
        ops[emoji] = chosenPlaces[i];
    });
};