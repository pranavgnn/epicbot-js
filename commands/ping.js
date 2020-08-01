exports.config = {
    name: "ping",
    cooldown: 3,
    guildOnly: false,
    staffOnly: false,
    description: "Mentions the bot's and the API's current latency. Also used to check if the bot is alive.",
    usage: "ping",
    category: "Miscellaneous",
};

exports.run = async (_, message) => {
    const otn = Math.round((new Date()).getTime());
    const m = await message.channel.send({ embed: { title: 'Ping?', color: '#eb98ff' } });
    const uts = message.createdTimestamp;
    const ntn = Math.abs(otn - uts);
    var embed = {
        embed: {
            title: '🏓 Pong!',
            color: '#eb98ff',
            description: `API Latency: \` ${m.createdTimestamp - message.createdTimestamp}ms \`\nBot Latency: \` ${ntn}ms \``,
        }
    };
    m.edit(embed);
};