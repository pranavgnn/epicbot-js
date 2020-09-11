exports.config = {
    name: "deletedm",
    cooldown: 3,
    guildOnly: false,
    staffOnly: true,
    description: "Deletes the already set up Direct Message reader and replier for the specified user.",
    usage: "deletedm <User ID>",
    category: "Staff Only",
};

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please enter an user ID!`);
    const user = bot.users.cache.get(args[0]);
    if (!user) return message.channel.send(`🚫 | That is not a valid user ID.`);
    const supportGuild = bot.guilds.cache.get(`719558358776152065`);
    var channel = supportGuild.channels.cache.find(c => c.name.split(`-`).reverse()[0] === user.id);
    if (!channel) return message.channel.send(`🚫 | There is no direct message channel for this user!`)
    await channel.delete();
    message.react(`✅`)
}