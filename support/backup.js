module.exports = bot => {
    function backup() {
        bot.channels.cache.get(`746357583115321384`).send(
            `Backup time: ${new Date(Date.now()).toUTCString()}`,
            {
                files: [`./json.sqlite`]
            }
        );
    };
    
    backup();
    setInterval(backup, 30 * 60 * 1000);
};