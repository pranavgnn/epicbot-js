exports.config = {
    name: "setdata",
    cooldown: 5,
    guildOnly: false,
    staffOnly: true,
    description: "Replaces the data file with the attached file.",
    usage: "setdata [Attachment URL]",
    category: "Staff Only",
};

const request = require("request");
const fs = require("fs");

exports.run = async (bot, message, args) => {
    var url;
    if (args[0] && args[0].startsWith(`https://`)) url = args[0];
    else {
        const attachment = message.attachments.array()[0];
        if (!attachment) return message.channel.send(`🚫 | Attachment not found.`);
        url = attachment.url;
    };

    if (url.split(`/`).reverse()[0] !== `json.sqlite`) return message.channel.send(`🚫 | Invalid filename.`);

    await request.get(url)
        .on('error', message.channel.send)
        .pipe(fs.createWriteStream(`./json.sqlite`));

    delete require.cache[require.resolve(`quick.db`)];
    message.channel.send(`Successfully piped the given attachment to the root.`);
};