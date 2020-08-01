exports.config = {
    name: "8ball",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Makes me reply in positive, negative or neutral to your question.",
    usage: "8ball <Question>",
    category: "Games",
};

var replies = [`Yes.`, `No.`, `Maybe?`, `Hecc yeah!`, `Hecc no!`, `We'll talk about this later.`, `Uhh yeah.`, `Umm nope.`, `I'm neutral for this.`, `Yes, I'm sure about that.`, `No, I'm sure about that.`, `I'm not sure about that.`]

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var embed = new MessageEmbed()
        .setTitle(`DIGITAL MAGIC 8BALL`)
        .setDescription(`Calculating results...`)
        .setColor(`#eb98ff`)
    var msg = await message.channel.send(embed)
    var botReply = replies[Math.floor(Math.random() * replies.length)]
    setTimeout(() => msg.edit(embed.setDescription(`Result:\n\`\`\`${botReply}\`\`\``).setTitle(args.join(` `))), 3000)
}