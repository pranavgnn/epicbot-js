exports.config = {
    name: "rps",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Brings you with a rock-paper-scissor match against me.",
    usage: "rps",
    category: "Games",
};

const { MessageEmbed } = require(`discord.js`)

var reactions = [`🥌`, `🗒️`, `✂️`]

exports.run = async (bot, message, args) => {
    var filter = (reaction, user) => {
        return reactions.includes(reaction.emoji.name) && user.id === message.author.id;
    };
    var msg = await message.channel.send(new MessageEmbed()
        .setTitle(`DIGITAL ROCK PAPER SCISSORS`)
        .setDescription(`Choose any one of the below:\n🥌 | Rock\n🗒️ | Paper\n✂️ | Scissors`)
        .setColor(`#eb98ff`)
    )
    var botChosen = reactions[Math.floor(Math.random() * reactions.length)]
    function game(reaction) {
        if (reaction === botChosen) return `tie`
        if (reaction === `🥌`) {
            if (botChosen === `🗒️`) return `lose`
            else return `win`
        } else if (reaction === `🗒️`) {
            if (botChosen === `✂️`) return `lose`
            else return `win`
        }else if (reaction === `✂️`) {
            if (botChosen === `🥌`) return `lose`
            else return `win`
        }
    }
    reactions.forEach(reaction => msg.react(reaction))
    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] }).then(collected => {
        msg.reactions.removeAll()
        var reaction = collected.first()
        var finalEmbed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`RPS | Results`)
        var result = game(reaction.emoji.name)
        if (result === `win`) finalEmbed.setDescription(`**You win!**\nYour choose: ${reaction.emoji}\nMy choose: ${botChosen}`)
        else if (result === `lose`) finalEmbed.setDescription(`**You lose!**\nYour choose: ${reaction.emoji}\nMy choose: ${botChosen}`)
        else finalEmbed.setDescription(`**Game is tie!**\nYour choose: ${reaction.emoji}\nMy choose: ${botChosen}`)
        msg.edit(new MessageEmbed().setColor(`#eb98ff`).setDescription(`Choosing my side...`))
        setTimeout(() => msg.edit(new MessageEmbed().setColor(`#eb98ff`).setDescription(`Calculating results...`)), 1500);
        setTimeout(() => msg.edit(finalEmbed), 4500);
    }).catch(() =>  msg.edit(new MessageEmbed().setColor(`#eb98ff`).setDescription(`${message.author}, you did not react in time!`)))
}