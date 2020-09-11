const db = require(`quick.db`);

module.exports = async message => {
    var data = await db.fetch(`messages_${message.guild.id}_${message.author.id}`) || 
    {
        count: 0,
        target: 50,
        level: 0,
        reward: 250
    };
    data.count += 1;
    await db.set(`messages_${message.guild.id}_${message.author.id}`, data);
    if (data.count === data.target) {
        var newData = {
            count: data.count,
            target: Math.round(data.target * (1.75 + 1)),
            level: data.level + 1,
            reward: Math.round(data.reward * (0.75 + 1))
        };
        db.set(`messages_${message.guild.id}_${message.author.id}`, newData);
        db.add(`cash_${message.author.id}`, data.reward);
        message.channel.send(new Discord.MessageEmbed()
            .setColor(`#eb98ff`)
            .setTitle(`Level Up!`)
            .setDescription(`GG! **${message.author.tag}** levelled up!`)
            .addField(`Level`, `Level ${newData.level}`, true)
            .addField(`Reward`, `${data.reward} coins`, true)
            .addField(`Current Balance`, `${db.fetch(`cash_${message.author.id}`)} coins`)
            .setTimestamp(message.createdTimestamp)
        );
    };
};