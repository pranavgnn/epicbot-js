exports.config = {
    name: "purge",
    aliases: ["clear", "cls", "clean"],
    cooldown: 3,
    guildOnly: true,
    description: "A command that will purge the amount of messages in the current channel.",
    usage: "purge <Amount>",
    category: "Management",
};


exports.run = async (bot, message, args) => {
    var amount = args[0];

    if (!amount) return message.reply(`You haven't given an amount of messages which should be deleted!`);
    if (isNaN(amount)) return message.reply(`The amount parameter isn't a number!`); 
    message.delete()
    if (amount > 100) return message.reply(`You can't delete more than 100 messages at once!`);
    if (amount < 1) return message.reply(`You have to delete at least 1 message!`);

    await message.channel.messages.fetch({ limit: amount }).then(messages => {
        message.channel.bulkDelete(messages);
    }).catch(err => {
        return message.channel.send(`Could not delete the messages. Make sure the messages are not older than 14 days.`)
    });
    const successMessage = message.channel.send(`Successfully deleted ${amount} number of messages!`);
    successMessage.delete(3000);
};