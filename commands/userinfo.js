exports.config = {
    name: "userinfo",
    cooldown: 5,
    guildOnly: true,
    staffOnly: false,
    description: "Sends a neat embed regarding some information about the mentioned user.",
    usage: "userinfo <User>",
    category: "Management",
};

const { MessageEmbed } = require(`discord.js`)

function sortBoolean(bool) {
    if (typeof bool !== 'boolean') return;
    if (bool === true) return `Yes`;
    else return `No`;
}

exports.run = async (bot, message, args) => {
    var user = require(`../modules/getUserFromMention.js`)(args[0], message.guild)
    if (user) user = user.user
    else user = message.author
    var fetchedUser = message.guild.members.cache.find(u => u.id === user.id)
    var createdDate = new Date(user.createdTimestamp)
    var joinedDate = new Date(fetchedUser.joinedTimestamp)
    console.log(fetchedUser.premiumSinceTimestamp)
    var nitroDate = new Date(fetchedUser.premiumSinceTimestamp || 0)
    var formattedCreatedDate = `${require(`../modules/numberPrefixes.js`)(createdDate.getDate())} ${require(`../modules/monthIndexToString.js`)(createdDate.getMonth())} ${createdDate.getFullYear()}`
    var formattedJoinedDate = `${require(`../modules/numberPrefixes.js`)(joinedDate.getDate())} ${require(`../modules/monthIndexToString.js`)(joinedDate.getMonth())} ${joinedDate.getFullYear()}`
    var formattedNitroDate = `${require(`../modules/numberPrefixes.js`)(nitroDate.getDate())} ${require(`../modules/monthIndexToString.js`)(nitroDate.getMonth())} ${nitroDate.getFullYear()}`
    if (formattedNitroDate === `1st January 1970`) formattedNitroDate = `No nitro`
    var infoEmbed = new MessageEmbed()
        .setThumbnail(user.avatarURL({dynamic: true, type: 'png'}))
        .setFooter(message.author.tag, message.author.avatarURL({dynamic: true, type: 'png'}))
        .setTimestamp(message.createdTimestamp)
        .setColor(`#eb98ff`)
        .setTitle(`Bot Information`)
        .addField(`Username`, user.username, true)
        .addField(`Discriminator`, `#` + user.discriminator, true)
        .addField(`ID`, user.id, true)
        .addField(`Nickname`, fetchedUser.nickname || `None`, true)
        .addField(`Created date`, formattedCreatedDate, true)
        .addField(`Server join date`, formattedJoinedDate, true)
        .addField(`Nitro since`, fetchedUser.premiumSince, true)
        .addField(`Roles count`, fetchedUser.roles.cache.size - 1, true)
        .addField(`Bot`, sortBoolean(user.bot))
        .addField(`Permissions`, require(`../modules/sortPermissions.js`)(fetchedUser.permissions.toArray()))
    message.channel.send(infoEmbed)
}