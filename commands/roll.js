exports.config = {
    name: "roll",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Rolls a six-faced die and mentions the outcome.",
    usage: "roll",
    category: "Games",
};

exports.run = async (_, message) => {
    var msg = await message.channel.send(`🎲 Rolling a dice, just for you ;) please wait...`)
    var random = Math.floor(Math.random() * 5) + 1
    setTimeout(() => {
        msg.edit(`🎲 I put in a lot of effort and rolled a die, just for you. The outcome is: \`${random}\``)
    }, 2000);
};