exports.config = {
    name: "meme",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Pulls out a random meme from r/memes and sends it to you.",
    usage: "meme",
    category: "Fun",
};

const { MessageEmbed } = require(`discord.js`);
const fetch = require(`node-fetch`)

exports.run = async (bot, message, args) => {
    fetch(`https://meme-api.herokuapp.com/gimme`)
        .then(res => res.json())
        .then(json => {
            var memeEmbed = new MessageEmbed()
                .setTitle(json.title)
                .setImage(json.url)
                .setDescription(`Image not loading? [Click here](${json.url}).`)
                .setColor(`#eb98ff`)
            message.channel.send(memeEmbed);
        });
};