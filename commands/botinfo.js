exports.config = {
    name: "botinfo",
    cooldown: 5,
    guildOnly: false,
    staffOnly: false,
    description: "Sends a neat embed regarding some information about the bot.",
    usage: "botinfo",
    category: "Miscellaneous",
};

const { MessageEmbed } = require(`discord.js`);
const {
    OWNER,
    STAFF
} = require(`../config.json`);

exports.run = async (bot, message, args) => {
    var createdDate = new Date(bot.user.createdTimestamp);
    var joinedDate = new Date(message.guild.me.joinedTimestamp);
    var formattedCreatedDate = `${require(`../modules/numberPrefixes.js`)(createdDate.getDate())} ${require(`../modules/monthIndexToString.js`)(createdDate.getMonth())} ${createdDate.getFullYear()}`;
    var formattedJoinedDate = `${require(`../modules/numberPrefixes.js`)(joinedDate.getDate())} ${require(`../modules/monthIndexToString.js`)(joinedDate.getMonth())} ${joinedDate.getFullYear()}`;
    var owner = bot.users.cache.find(u => u.id === OWNER).tag || `Vex#0017`;
    var infoEmbed = new MessageEmbed()
        .setColor(`#eb98ff`)
        .setTitle(`Bot Information`)
        .addField(`Username`, bot.user.username, true)
        .addField(`Discriminator`, `#` + bot.user.discriminator, true)
        .addField(`ID`, bot.user.id, true)
        .addField(`Nickname`, message.guild.me.nickname || `None`, true)
        .addField(`Uptime`, require(`../modules/secondsToDhms`)(Math.round(bot.uptime / 1000)), true)
        .addField(`Created date`, formattedCreatedDate, true)
        .addField(`Server join date`, formattedJoinedDate, true)
        .addField(`Servers`, bot.guilds.cache.size, true)
        .addField(`Users`, bot.users.cache.size, true)
        .addField(`Channels`, bot.channels.cache.size, true)
        .addField(`Creator`, owner, true)
        .setThumbnail(bot.user.avatarURL({dynamic: true, type: 'png'}))
        .setFooter(message.author.tag, message.author.avatarURL({dynamic: true, type: 'png'}))
        .setTimestamp(message.createdTimestamp);
    var staffs  = ``;
    for (let currentStaff of STAFF) {
        staffs = `${staffs}${bot.users.cache.find(u => u.id === currentStaff).tag}\n`;
    };
    if (!staffs || staffs === ``) staffs = `Nobody!`;
    infoEmbed.addField(`Staff`, staffs, true);
    infoEmbed.addField(`Invite link`, `[Click here](https://discord.com/oauth2/authorize?client_id=737959032266162266&permissions=8&scope=bot)`, true);
    infoEmbed.addField(`Support server link`, `[Click here](https://discord.gg/f6ZnyGW)`, true);
    infoEmbed.addField(`Vote link`, `[Click here](https://top.gg/bot/737959032266162266/vote)`, true);
    //infoEmbed.addField(`Donate link`, `[Click here](#)`, true);
    message.channel.send(infoEmbed);
};