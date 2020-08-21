exports.config = {
    name: "asciify",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Ascii-fies the specified text and sends in the channel.",
    usage: "asciify <Text>",
    category: "Fun",
};

const fetch = require(`node-fetch`)

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please specify some text!`);
    fetch(`http://artii.herokuapp.com/make?text=${args.join(`+`)}`)
        .then(res => {
            message.channel.send(`\`\`\`${Buffer.concat(res.body.buffer.head)}\`\`\``)
            console.log(res.body)
        });
}