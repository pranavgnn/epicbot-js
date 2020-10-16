exports.config = {
    name: "createdm",
    cooldown: 3,
    guildOnly: false,
    staffOnly: true,
    description: "Sets up a Direct Message reader and replier to the specified user's direct messages.",
    usage: "createdm <User ID>",
    category: "Staff Only",
};

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please enter an user ID!`);
    const user = bot.users.cache.get(args[0]);
    if (!user) return message.channel.send(`🚫 | That is not a valid user ID.`);
    const supportGuild = bot.guilds.cache.get(`719558358776152065`);
    var channel = supportGuild.channels.cache.find(c => c.name.split(`-`).reverse()[0] === user.id);
    if (channel) return message.channel.send(`🚫 | That direct message has already been created.`)
    const parentCategory = supportGuild.channels.cache.find(c => c.name.toLowerCase() === `direct messages` && c.type === `category`);
    channel = await supportGuild.channels.create(
        `${user.username}-${user.id}`,
        {
            type: `text`,
            parent: parentCategory,
            topic: `**User Information**\nTag: ${user.tag}\nID: ${user.id}`
        }
    );
    message.react(`✅`);
};