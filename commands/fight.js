exports.config = {
    name: "fight",
    cooldown: 60,
    guildOnly: true,
    staffOnly: false,
    description: "Begins a fight between you and the specified user as the opponent.",
    usage: "fight <user>",
    category: "Games",
};

const getUserFromMention = require(`../modules/getUserFromMention.js`);

exports.run = async (_, message, args) => {
    var user = getUserFromMention(args[0], message.guild);
    if (!user) return message.channel.send(`🚫 | That user isn't in this server!`);
    if (user.user.bot) return message.channel.send(`Wow. Are you so noob that you head out to fight bots?`);
    if (message.author === user.user) return message.channel.send(`Wow. Imagine fighting with yourself.`);
    var healths = {};
    healths[message.author] = 100;
    healths[user.user] = 100;
    var iterate = 0;
    var participants = [user.user, message.author];
    function heal(author) {
        if (healths[author] >= 100) return message.channel.send(`${author}, lol what a wimp. How do you think I can heal you when you have full health?`);
        var health = Math.floor(Math.random() * 20);
        if ((healths[author] + health) > 100) return message.channel.send(`${author}, unfortunately, I chose to give you **${health}HP**, which if added to your health would cross the max health. Sad you lost one chance but do I care about you? Hecc no!`);
        healths[author] += health;
        message.channel.send(`🟩 **${author}**, I incremented your health by **${health}HP**. You now have the health of **${healths[author]}HP**!`);
    };
    function createPrompt() {
        if (iterate > 1) iterate = 0;
        var author = participants[iterate];
        var opponent = participants[iterate + 1];
        if (iterate === 1) opponent = participants[iterate - 1];
        message.channel.awaitMessages(response => response.author.id === participants[iterate].id, {max: 1, time: 30000})
        .then(collections => {
            var resp = collections.first();
            if (resp.content.toLowerCase() === 'hit') {
                var damage = Math.floor(Math.random() * 35);
                healths[opponent] -= damage;
                if (healths[opponent] <= 0) return message.channel.send(`Lol what a loser, **${opponent.username}** has died, thanks to the hit of **${author.username}**. Hopefully they respawn LOL. ${resp.author} wins!`);
                if (damage === 0) message.channel.send(`Sad, **${author.username}** wasn't lucky enough and dealt no damage to **${opponent.username}**.`);
                else message.channel.send(`🟥 **${author.username}** hit **${opponent.username}** and **${opponent.username}** lost **${damage}HP**!\n**${opponent.username}** is now left with **${healths[opponent]}HP**!`);
            }
            else if (resp.content.toLowerCase() === 'heal') heal(author)
            else if (resp.content.toLowerCase() === 'quit') return message.channel.send(`${resp.author} just quit the game lol they suck at life`);
            else return message.channel.send(`\`${resp.content}\` is not a valid choice you tryna fool me or something? The game ends because **${resp.author.username}** made a goddamn typo. ${opponent} wins!`);
            iterate++;
            message.channel.send(`${opponent}, its now your turn! What do you want to do? \`hit\`, \`heal\`, \`quit\``);
            createPrompt();
        })
        .catch(() => message.channel.send(`Lol **${author.username}** did not respond in time. What a wimp! ${opponent} wins!`));
    };
    return msg = await message.channel.send(`**${message.author.username}** and **${user.user.username}** both have a health of **100HP**.\n⚔️ Let's begin the match.\n${user}, what do you want to do? \`hit\`, \`heal\`, \`quit\``)
        .then(createPrompt());
};