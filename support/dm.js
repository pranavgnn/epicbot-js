function attachUrl(message) {
    const returnArray = [];
    message.attachments.forEach((currentAttach, i) => {
        returnArray.push(currentAttach.url);
    });
    return returnArray;
};

function format(str) {
    return str
        .replace(/!/g, "-")
        .replace(/@/g, "-")
        .replace(/#/g, "-")
        .replace(/\$/g, "-")
        .replace(/%/g, "-")
        .replace(/\^/g, "-")
        .replace(/&/g, "-")
        .replace(/\*/g, "-")
        .replace(/\(/g, "-")
        .replace(/\)/g, "-")
        .replace(/_/g, "-")
        .replace(/\+/g, "-")
        .replace(/=/g, "-")
        .replace(/{/g, "-")
        .replace(/\[/g, "-")
        .replace(/}/g, "-")
        .replace(/\]/g, "-")
        .replace(/\\/g, "-")
        .replace(/\|/g, "-")
        .replace(/:/g, "-")
        .replace(/;/g, "-")
        .replace(/"/g, "-")
        .replace(/'/g, "-")
        .replace(/</g, "-")
        .replace(/,/g, "-")
        .replace(/>/g, "-")
        .replace(/./g, "-")
        .replace(/\?/g, "-")
        .replace(/\//g, "-")
        .replace(/ /g, "-")
}

exports.saveDM = async (bot, message) => {
    const supportGuild = bot.guilds.cache.get(`719558358776152065`);
    var channel = supportGuild.channels.cache.find(c => c.name.split(`-`).reverse()[0] === message.author.id);
    if (!channel) {
        const parentCategory = supportGuild.channels.cache.find(c => c.name.toLowerCase() === `direct messages` && c.type === `category`);
        channel = await supportGuild.channels.create(
            `${message.author.username}-${message.author.id}`,
            {
                type: `text`,
                parent: parentCategory
            }
        );
    };
    channel.send(`**[${message.author.username}]**\n${message.content}`, {files: attachUrl(message)});
    channel.edit({
        name: `${message.author.username}-${message.author.id}`,
        topic: `**User Information**\nTag: ${message.author.tag}\nID: ${message.author.id}`
    });
};

exports.sendDM = async (bot, message) => {
    const user = bot.users.cache.get(message.channel.name.split(`-`).reverse()[0]);
    user.send(message.content, {files: attachUrl(message)})
    .then(() => {
        message.react(`✅`);
    })
    .catch(() => {
        return message.react(`❎`);
    });

};