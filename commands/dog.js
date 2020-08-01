exports.config = {
    name: "dog",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Sends a random dog image in the channel along with the breed name.",
    usage: "dog",
    category: "Fun",
};

const fetch = require(`node-fetch`)

const { MessageEmbed } = require(`discord.js`)

exports.run = async (bot, message, args) => {
    fetch(`https://api.thedogapi.com/v1/images/search?size=small&has_breeds=true`)
        .then(res => res.json())
        .then(json => {
            var catEmbed = new MessageEmbed()
                .setTitle(json[0].breeds[0].name)
                .setImage(json[0].url)
                .setDescription(`Image not loading? [Click here](${json[0].url}).`)
                .setColor(`#eb98ff`)
            message.channel.send(catEmbed);
        });
}