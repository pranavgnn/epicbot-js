const db = require(`quick.db`);

module.exports = async (guild) => {
    await db.delete(`prefixes_${guild.id}`);
    const all = db.all();
    all.forEach(async currentDb => {
        if (currentDb.ID.split(`_`)[1] === guild.id) await db.delete(currentDb.ID);
    });
};