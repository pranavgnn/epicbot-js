const db = require(`quick.db`);

module.exports = async (bot, guild) => {
   var channelID;
    for (let c of guild.channels.cache) {
        if (!c.permissionsLocked) channelID = c.id;
    };

    const welcomeMessage = `**Hello ${guild.owner}!**\nI'm EpiCord, an *Epi*c bot!\n\nLet's get started!\n1. You may not like the default prefix "${require(`../config.json`).PREFIXES[0]}". To add a custom prefix, please do ${require(`../config.json`).PREFIXES[0]}prefix add <Prefix Here>. (Quick tip: I support multiple prefixes, you can add or remove any!)\n2. Check if you have given me permissions. I am a feature-packed bot from moderation to economy, and I pretty much need permissions.\n\nYou have set me up! Thank you for adding me to your server! In case you want help with anything, please join my support server (https://discord.gg/f6ZnyGW).`
    
    const channel = bot.channels.cache.get(channelID);
    if (channel)
        channel.send(welcomeMessage);
    else
        guild.owner.send(welcomeMessage);

    db.set(`prefixes_${guild.id}`, require(`../config.json`).PREFIXES)
};