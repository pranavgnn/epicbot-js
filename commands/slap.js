exports.config = {
    name: "slap",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Sends a random anime-slapping gif in the chat.",
    usage: "slap [User]",
    category: "Fun",
};

const fetch = require(`node-fetch`)

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    var user
    if (args[0]) user = require(`../modules/getUserFromMention.js`)(args[0], message.guild).user.username
    else user = `nobody`
    fetch(`https://api.tenor.com/v1/search?q=anime-slap&key=EN1W1PBUIRQQ&limit=50`)
        .then(res => res.json())
        .then(json => {
            var random = Math.floor(Math.random() * json.results.length)
            var slapEmbed = new MessageEmbed()
                .setTitle(`${message.author.username} lands with a powerful slap on ${user}! Ouch that hurts!`)
                .setImage(json.results[random].media[0].gif.url)
                .setDescription(`Gif not loading? [Click here](${json.results[random].url}).`)
                .setColor(`#eb98ff`)
            message.channel.send(slapEmbed);
        });
}