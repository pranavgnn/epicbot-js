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
    fetch(`https://www.reddit.com/r/meme/random.json`)
        .then(res => res.json())
        .then(json => {
            const fetchData = json[0].data.children[0].data;
            var memeEmbed = new MessageEmbed()
                .setTitle(fetchData.title)
                .setImage(fetchData.url)
                .setDescription(`By **${fetchData.author}**\nImage not loading? [Click here](${fetchData.url_overridden_by_dest}).`)
                .setFooter(`👍 ${fetchData.ups} | 💬 ${fetchData.num_comments} | ${fetchData.upvote_ratio * 100}% ⬆️`)
                .setColor(`#eb98ff`)
            message.channel.send(memeEmbed);
        });
};