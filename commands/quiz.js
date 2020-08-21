exports.config = {
    name: "quiz",
    cooldown: 120,
    guildOnly: false,
    staffOnly: false,
    description: "Provides a multiple-choice question which if answered right will award you 100 coins.",
    usage: "quiz",
    category: "Games",
};

function format(str) {
    return str
        .replace(/&amp;/g, "&")
        .replace(/&gt;/g, ">")
        .replace(/&lt;/g, "<")
        .replace(/&quot;/g, "\"")
        .replace(/&ldquo;/g, "“")
        .replace(/&rdquo;/g, "”")
        .replace(/&lsquo;/g, "‘")
        .replace(/&rsquo;/g, "’")
        .replace(/&#039;/g, "'")
};

const fetch = require(`node-fetch`);
const { MessageEmbed } = require(`discord.js`);
const db = require(`quick.db`);

exports.run = async (bot, message, args) => {
    fetch(`https://opentdb.com/api.php?amount=1&category=${Math.ceil(Math.random() * 12) + 9}&difficulty=${["easy", "medium", "hard"][Math.floor(Math.random() * 3)]}&type=multiple`)
    .then(res => res.json()
    .then(async json => {
        const result = json.results[0];
        const embed = new MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(format(result.question))
            .addField(`Category`, result.category, true)
            .addField(`Difficulty`, result.difficulty[0].toUpperCase() + result.difficulty.slice(1), true)
            .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
        const choices = result.incorrect_answers;
        choices.push(result.correct_answer);
        choices.sort(() => Math.random() - 0.5);
        const ops = ["A", "B", "C", "D"];
        choices.forEach((choice, i) => {
            embed.addField(`Option ${ops[i]}`, format(choice))
        })
        const msg = await message.channel.send(embed)
        const emojis = ["🇦", "🇧", "🇨", "🇩"]
        const answers = {};
        emojis.forEach(async (emoji, i) => {
            await msg.react(emoji);
            answers[emoji] = choices[i]
        })
        const filter = (addedReact, user) => {
            return emojis.includes(addedReact.emoji.name) && user.id === message.author.id
        }
        msg.awaitReactions(filter, { max: 1, time: 60000 })
            .then(collected => {
                msg.reactions.removeAll()
                const react = collected.first()
                var choice = answers[react.emoji.name];
                const finalEmbed = new MessageEmbed()
                    .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
                    .setTimestamp(message.createdTimestamp)
                    .addField(`Correct answer`, format(result.correct_answer))
                    .addField(`Your answer`, format(choice))
                if (result.correct_answer === choice) {
                    finalEmbed.setColor(`#00ff00`);
                    finalEmbed.setTitle(`Correct answer!`);
                    finalEmbed.setDescription(`You answered right! 100 coins were added to your wallet!`);
                    db.add(`cash_${message.author.id}`, 100)
                }
                else {
                    finalEmbed.setColor(`#ff0000`);
                    finalEmbed.setTitle(`Wrong answer!`);
                    finalEmbed.setDescription(`Sadly, your answer was wrong. Wait, why do I have to be sad?`);
                }
                message.channel.send(finalEmbed)
            }).catch(() => {
                message.channel.send(`Lol, you took way too long to google it out! The time ran out.`)  
            })
    }))
}