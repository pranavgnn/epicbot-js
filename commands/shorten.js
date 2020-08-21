exports.config = {
    name: "shorten",
    aliases: ["bitly", "shorturl", "shortlink"],
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Shortens a provided URL using the bit.ly api.",
    usage: "shorten <URL>",
    category: "Management",
};

const bitlyClient = require(`bitly`).BitlyClient;
const bitly = new bitlyClient(`22df334f0f1e1241e4f4454bfe727d53a8f72343`);

const { MessageEmbed } = require(`discord.js`);

exports.run = async (bot, message, args) => {
    const url = args[0];
    if (!url) return message.channel.send(`🚫 | Please specify an URL!`)
    if (!url.startsWith(`http://`) && !url.startsWith(`https://`)) return message.channel.send(`🚫 | That's not a valid url!`);
    const embed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Shortening URL...`)
        .addField(`Provided URL`, url)
        .setTimestamp(message.createdTimestamp)
        .setFooter(message.author.tag, message.author.avatarURL({dynamic: true}))
        .setThumbnail(`https://docrdsfx76ssb.cloudfront.net/static/1597867906/pages/wp-content/uploads/2019/02/bitly.png`)
        .setDescription(`Supported by [bit.ly](https://bit.ly)`)
    const msg = await message.channel.send(embed);
    const prevTimestamp = Date.now();
    const resp = await bitly.shorten(url);
    embed.setTitle(`Successfully shortened!`);
    embed.addField(`Shortened URL`, resp.link);
    embed.addField(`Time taken`, `${Math.round((Date.now() - prevTimestamp) * 10) / 10000} seconds`);
    msg.edit(embed);
};