exports.config = {
    name: "viewcode",
    cooldown: 0,
    guildOnly: false,
    staffOnly: true,
    description: "Allows the staff to view a certain file of code.",
    usage: "viewcode <Path>",
    category: "Staff Only",
};

const fs = require(`fs`);
const { Util, MessageEmbed } = require(`discord.js`);

const iterates = {};

const emojis = [`⬅️`, `➡️`, `⏹️`];

exports.run = async (bot, message, args) => {
    if (!args[0]) return message.channel.send(`🚫 | Please specify a path.`);
    var file;
    try {
        file = fs.readFileSync(args[0]);
    } catch (e) {
        return message.channel.send(`🚫 | No such file found.`);
    };
    const split = Util.splitMessage(file, { maxLength: 2000 });

    const extension = args[0].split(`.`).reverse()[0];

    const embed = new MessageEmbed()
        .setTitle(`Code of ${args[0].split(`/`).reverse()[0]}` || args[0].split(`\\`.reverse()[0]))
        .setColor(`#eb98ff`)
        .setDescription(`\`\`\`${extension}\n${split[0]}\`\`\``);

    const msg = await message.channel.send(embed);

    if (!split[1]) return;

    embed.setTitle(``);
    iterates[message.author.id] = 0;

    function reactEmojis() {
        for (emoji of emojis) msg.react(emoji);
    };
    reactEmojis();

    const filter = (reaction, user) => {
        return emojis.includes(reaction.emoji.name) && user.id === message.author.id;
    };

    function reactionFunction() {
        function changePage() {
            var newPage = split[iterates[message.author.id]];
            msg.edit(embed.setDescription(`\`\`\`${extension}\n${newPage}\`\`\``));
            reactionFunction();
        };
        msg.awaitReactions(filter, { max: 1, time: 2 * 60 * 1000 })
            .then(collected => {
                console.log(iterates[message.author.id])
                const react = collected.first();
                if (react.emoji.name === `⬅️`)
                    if (iterates[message.author.id] > 0) {
                        iterates[message.author.id] --;
                        changePage();
                    };
                if (react.emoji.name === `➡️`)
                    if (iterates[message.author.id] < split.length - 1) {
                        iterates[message.author.id] ++;
                        changePage();
                    };
                if (react.emoji.name === `⏹️`) {
                    msg.delete();
                    message.react(`746291779506143253`);
                };
                const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(message.author.id));
                for (const reaction of userReactions.values()) {
                    reaction.users.remove(message.author.id);
                };
        }).catch(console.log);
    };
    reactionFunction();
};